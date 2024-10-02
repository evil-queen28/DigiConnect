(function() {
    let currentLanguage = 'en';
    let currentAudio = null;
    let currentlyPlayingMessageElement = null;
    let isListening = false;

    // Initialization
    document.addEventListener('DOMContentLoaded', function() {
        initializeEventListeners();
        initializeLanguageSelector();
        initializeChat();
    });

    function initializeEventListeners() {
        const userInput = document.getElementById("user-input");
        const sendButton = document.getElementById("send-button");
        const voiceButton = document.getElementById("voice-button");

        userInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
            }
        });

        sendButton.addEventListener("click", sendMessage);
        voiceButton.addEventListener("click", toggleVoiceInput);
    }

    async function initializeLanguageSelector() {
        const languageSelector = document.getElementById('language-selector');
        try {
            const response = await fetch('/api/languages');
            const languages = await response.json();
            
            languages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;
                option.textContent = lang.name;
                languageSelector.appendChild(option);
            });

            languageSelector.addEventListener('change', async (event) => {
                currentLanguage = event.target.value;
                await setLanguage(currentLanguage);
                await initializeChat();
            });
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    }

    async function initializeChat() {
        try {
            const response = await fetch('/api/greeting');
            const result = await response.json();
            addMessageToChat('bot', result.greeting);
        } catch (error) {
            console.error('Error fetching greeting:', error);
            addMessageToChat('bot', 'Welcome to the Government Services Chatbot. How may I assist you today?');
        }
    }

    async function setLanguage(languageCode) {
        try {
            const response = await fetch('/api/set_language', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: languageCode })
            });
            const result = await response.json();
            if (!result.success) {
                console.error('Error setting language:', result.error);
            }
        } catch (error) {
            console.error('Error setting language:', error);
        }
    }

    async function sendMessage() {
        const userInput = document.getElementById("user-input");
        const chatBox = document.getElementById("chat-box");
        const message = userInput.value.trim();

        if (!message) return;

        addMessageToChat('user', message);
        userInput.value = '';
        showTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            const result = await response.json();
            removeTypingIndicator();
            addMessageToChat('bot', result.response || 'I apologize, but I couldn\'t process that request. Please try rephrasing your question.');
        } catch (error) {
            console.error('Error sending message:', error);
            removeTypingIndicator();
            addMessageToChat('bot', 'I apologize, but an error occurred while processing your request. Please try again later or contact our support team.');
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function addMessageToChat(sender, message) {
        const chatBox = document.getElementById("chat-box");
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container', `${sender}-message-container`);
        
        const avatarElement = document.createElement('img');
        avatarElement.classList.add('avatar');
        avatarElement.src = `/static/images/${sender}-avatar.svg`;
        avatarElement.alt = `${sender.charAt(0).toUpperCase() + sender.slice(1)} Avatar`;
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        const formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/\n/g, '<br>')
                                        .replace(/•/g, '&bull;');
        
        messageElement.innerHTML = formattedMessage;

        if (sender === 'bot') {
            addAudioControls(messageElement, message);
        }
        
        messageContainer.appendChild(avatarElement);
        messageContainer.appendChild(messageElement);
        chatBox.appendChild(messageContainer);
        
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function addAudioControls(messageElement, message) {
        const audioControls = document.createElement('div');
        audioControls.classList.add('audio-controls');

        const speakerIcon = document.createElement('img');
        speakerIcon.src = '/static/images/speaker-icon.png';
        speakerIcon.alt = 'Text-to-Speech';
        speakerIcon.classList.add('speaker-icon');
        speakerIcon.addEventListener('click', () => playTextToSpeech(message, messageElement));

        const stopIcon = document.createElement('img');
        stopIcon.src = '/static/images/stop-icon.png';
        stopIcon.alt = 'Stop Audio';
        stopIcon.classList.add('stop-icon');
        stopIcon.style.display = 'none';
        stopIcon.addEventListener('click', () => stopTextToSpeech(messageElement));

        audioControls.appendChild(speakerIcon);
        audioControls.appendChild(stopIcon);
        messageElement.appendChild(audioControls);
    }

    function showTypingIndicator() {
        const chatBox = document.getElementById("chat-box");
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.classList.add('message', 'bot-message');
        typingIndicator.innerHTML = 'Typing...<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function toggleVoiceInput() {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }

    function startListening() {
        isListening = true;
        document.getElementById('voice-button').classList.add('listening');
        addMessageToChat('user', 'Listening...');
    
        fetch('/api/voice_input', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    addMessageToChat('bot', data.error);
                } else {
                    addMessageToChat('user', `${data.recognized_text} (Detected: ${data.detected_language})`);
                    addMessageToChat('bot', data.response);
                    playTextToSpeech(data.response, document.querySelector('.bot-message:last-child'));
                }
                stopListening();
            })
            .catch(error => {
                console.error('Error:', error);
                addMessageToChat('bot', 'An error occurred while processing your voice input. Please try again.');
                stopListening();
            });
    }

    function stopListening() {
        isListening = false;
        document.getElementById('voice-button').classList.remove('listening');
    }

    async function playTextToSpeech(text, messageElement) {
        if (currentAudio) {
            stopTextToSpeech(currentlyPlayingMessageElement);
        }

        try {
            const response = await fetch('/api/text_to_speech', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            currentAudio = new Audio(audioUrl);

            currentAudio.addEventListener('ended', () => {
                stopTextToSpeech(messageElement);
            });

            currentAudio.play();
            currentlyPlayingMessageElement = messageElement;

            toggleAudioIcons(messageElement, true);
        } catch (error) {
            console.error('Error playing text-to-speech:', error);
            alert('An error occurred while playing the audio. Please try again.');
        }
    }

    function stopTextToSpeech(messageElement) {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }

        if (messageElement) {
            toggleAudioIcons(messageElement, false);
        }

        currentlyPlayingMessageElement = null;
    }

    function toggleAudioIcons(messageElement, isPlaying) {
        const audioControls = messageElement.querySelector('.audio-controls');
        if (audioControls) {
            audioControls.querySelector('.speaker-icon').style.display = isPlaying ? 'none' : 'inline';
            audioControls.querySelector('.stop-icon').style.display = isPlaying ? 'inline' : 'none';
        }
    }
})();