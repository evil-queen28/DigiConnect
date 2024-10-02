let userProfile = null;
let currentQuest = null;
const quests = {
    UPI: {
        title: "UPI",
        description: "Learn about Unified Payments Interface",
        points: 500,
        questions: [
            {
                _id: "upi_1",
                title: "UPI Basics",
                description: "Learn the basics of UPI and its key features.",
                points: 50,
                type: "multiple_choice",
                question: "Which organization developed UPI?",
                options: [
                    { id: "opt1", text: "National Payments Corporation of India (NPCI)", correct: true },
                    { id: "opt2", text: "Reserve Bank of India (RBI)", correct: false },
                    { id: "opt3", text: "State Bank of India (SBI)", correct: false }
                ],
                explanation: "UPI was developed by NPCI to enable instant payments between banks using a mobile platform."
            },
            {
                _id: "upi_2",
                title: "UPI Security",
                description: "Learn about UPI's security features.",
                points: 60,
                type: "drag_and_drop",
                items: [
                    { id: "1", text: "Two-Factor Authentication" },
                    { id: "2", text: "Encrypted Transactions" },
                    { id: "3", text: "Open Networks" }
                ],
                slots: [
                    { id: "a", label: "UPI Security Feature" },
                    { id: "b", label: "Non-Security Feature" }
                ],
                correctPlacements: { a: ["1", "2"], b: ["3"] },
                explanation: "UPI uses two-factor authentication and encrypted transactions to ensure security, while open networks are not a feature of UPI security."
            },
            {
                _id: "upi_3",
                title: "UPI Transaction Limits",
                description: "Understand the transaction limits in UPI.",
                points: 60,
                type: "multiple_choice",
                question: "What is the default per-transaction limit for UPI?",
                options: [
                    { id: "opt1", text: "₹1,00,000", correct: true },
                    { id: "opt2", text: "₹50,000", correct: false },
                    { id: "opt3", text: "₹2,00,000", correct: false }
                ],
                explanation: "The default per-transaction limit for UPI is ₹1,00,000. However, this limit can vary based on the bank and user settings."
            },
            {
                _id: "upi_4",
                title: "UPI Payment Address",
                description: "Learn about UPI payment addresses.",
                points: 40,
                type: "fill_in_the_blank",
                question: "A UPI payment address typically follows the format: username@________",
                answer: "bankname",
                explanation: "UPI payment addresses are usually in the format username@bankname, such as johndoe@okaxis or janedoe@ybl."
            },
            {
                _id: "upi_5",
                title: "UPI Transaction Types",
                description: "Understand different types of UPI transactions.",
                points: 50,
                type: "matching",
                items: [
                    { id: "1", text: "P2P" },
                    { id: "2", text: "P2M" },
                    { id: "3", text: "Cash@POS" }
                ],
                matches: [
                    { id: "a", text: "Person to Person payments" },
                    { id: "b", text: "Person to Merchant payments" },
                    { id: "c", text: "Withdrawal of cash at merchant locations" }
                ],
                correctMatches: { "1": "a", "2": "b", "3": "c" },
                explanation: "UPI supports various transaction types including P2P (Person to Person), P2M (Person to Merchant), and Cash@POS for cash withdrawals at merchant locations."
            },
            {
                _id: "upi_6",
                title: "UPI Transaction Flow",
                description: "Understand the steps in a UPI transaction.",
                points: 70,
                type: "ordering",
                items: [
                    { id: "1", text: "User initiates payment" },
                    { id: "2", text: "UPI app sends request to NPCI" },
                    { id: "3", text: "NPCI routes request to receiver's bank" },
                    { id: "4", text: "Receiver's bank validates and processes payment" },
                    { id: "5", text: "Confirmation sent back through NPCI" },
                    { id: "6", text: "User receives transaction confirmation" }
                ],
                correctOrder: ["1", "2", "3", "4", "5", "6"],
                explanation: "This is the typical flow of a UPI transaction, from initiation to confirmation."
            },
            {
                _id: "upi_7",
                title: "UPI PIN",
                description: "Learn about the UPI PIN.",
                points: 50,
                type: "true_false",
                question: "The UPI PIN is the same as your bank account PIN.",
                answer: false,
                explanation: "The UPI PIN is a separate PIN created specifically for UPI transactions and is not the same as your bank account PIN."
            },
        
            // ... (more UPI questions)
        ]
    },
    Aadhaar: {
        title: "Aadhaar",
        description: "Learn about Aadhaar and its features",
        points: 450,
        questions: [
            {
                _id: "aadhaar_1",
                title: "Aadhaar Overview",
                description: "Introduction to Aadhaar and its core features.",
                points: 70,
                type: "multiple_choice",
                question: "What is the primary purpose of Aadhaar?",
                options: [
                    { id: "opt1", text: "Provide a unique identity for residents", correct: true },
                    { id: "opt2", text: "Issue driving licenses", correct: false },
                    { id: "opt3", text: "Store passport information", correct: false }
                ],
                explanation: "Aadhaar is designed to provide a unique identity for residents of India using biometric and demographic data."
            },
            {
                _id: "aadhaar_2",
                title: "Aadhaar Number",
                description: "Learn about the Aadhaar number structure.",
                points: 50,
                type: "fill_in_the_blank",
                question: "An Aadhaar number consists of ____ digits.",
                answer: "12",
                explanation: "Every Aadhaar number is a unique 12-digit number assigned to an individual."
            },
            {
                _id: "aadhaar_3",
                title: "Aadhaar Enrollment",
                description: "Understand the Aadhaar enrollment process.",
                points: 60,
                type: "ordering",
                items: [
                    { id: "1", text: "Visit an Aadhaar enrollment center" },
                    { id: "2", text: "Fill out the enrollment form" },
                    { id: "3", text: "Provide biometric data" },
                    { id: "4", text: "Submit supporting documents" },
                    { id: "5", text: "Receive enrollment acknowledgment slip" }
                ],
                correctOrder: ["1", "2", "4", "3", "5"],
                explanation: "The Aadhaar enrollment process typically follows these steps in order."
            },
            {
                _id: "aadhaar_4",
                title: "Aadhaar Authentication",
                description: "Learn about different Aadhaar authentication methods.",
                points: 70,
                type: "multiple_select",
                question: "Which of the following are valid Aadhaar authentication methods? (Select all that apply)",
                options: [
                    { id: "opt1", text: "Fingerprint", correct: true },
                    { id: "opt2", text: "Iris scan", correct: true },
                    { id: "opt3", text: "Face recognition", correct: true },
                    { id: "opt4", text: "Voice recognition", correct: false },
                    { id: "opt5", text: "OTP", correct: true }
                ],
                explanation: "Aadhaar supports authentication through fingerprints, iris scans, face recognition, and OTP. Voice recognition is not currently a supported method."
            },
            {
                _id: "aadhaar_5",
                title: "Aadhaar Data Security",
                description: "Understand Aadhaar's data protection measures.",
                points: 80,
                type: "drag_and_drop",
                items: [
                    { id: "1", text: "2048-bit encryption" },
                    { id: "2", text: "Tokenization" },
                    { id: "3", text: "Biometric locking" },
                    { id: "4", text: "Social media integration" },
                    { id: "5", text: "Virtual ID" }
                ],
                slots: [
                    { id: "a", label: "Aadhaar Security Feature" },
                    { id: "b", label: "Not an Aadhaar Security Feature" }
                ],
                correctPlacements: { a: ["1", "2", "3", "5"], b: ["4"] },
                explanation: "Aadhaar employs various security measures including encryption, tokenization, biometric locking, and Virtual ID. Social media integration is not a security feature of Aadhaar."
            },
            // ... (more Aadhaar questions)
        ]
    },
    DigiLocker: {
        title: "DigiLocker",
        description: "Learn about DigiLocker and its uses",
        points: 400,
        questions: [
            {
                _id: "digilocker_1",
                title: "DigiLocker Basics",
                description: "Understand DigiLocker's role in storing documents.",
                points: 60,
                type: "multiple_choice",
                question: "What kind of documents can you store in DigiLocker?",
                options: [
                    { id: "opt1", text: "Government-issued documents", correct: true },
                    { id: "opt2", text: "Personal photos", correct: false },
                    { id: "opt3", text: "Entertainment videos", correct: false }
                ],
                explanation: "DigiLocker is meant for storing government-issued documents such as driving licenses, Aadhaar, PAN cards, etc."
            },
            {
                _id: "digilocker_2",
                title: "DigiLocker Features",
                description: "Learn about the key features of DigiLocker.",
                points: 50,
                type: "true_false",
                question: "DigiLocker allows users to share documents electronically with registered requesters.",
                answer: true,
                explanation: "DigiLocker enables secure sharing of documents with registered organizations, eliminating the need for physical documents."
            },
            {
                _id: "digilocker_3",
                title: "DigiLocker Access",
                description: "Understand how to access DigiLocker.",
                points: 40,
                type: "fill_in_the_blank",
                question: "To access DigiLocker, you need to sign up using your ________ number.",
                answer: "Aadhaar",
                explanation: "DigiLocker accounts are linked to the user's Aadhaar number for secure access and authentication."
            },
            // ... (more DigiLocker questions)
        ]
    },
    BHIM: {
        title: "BHIM",
        description: "Learn about Bharat Interface for Money (BHIM)",
        points: 350,
        questions: [
            {
                _id: "bhim_1",
                title: "BHIM Basics",
                description: "Understand the fundamentals of BHIM app.",
                points: 50,
                type: "multiple_choice",
                question: "What does BHIM stand for?",
                options: [
                    { id: "opt1", text: "Bharat Interface for Money", correct: true },
                    { id: "opt2", text: "Bank Hosted Interface Module", correct: false },
                    { id: "opt3", text: "Biometric Hybrid Integration Method", correct: false }
                ],
                explanation: "BHIM stands for Bharat Interface for Money, a mobile payment app based on UPI."
            },
            {
                _id: "bhim_2",
                title: "BHIM Features",
                description: "Learn about the key features of BHIM app.",
                points: 60,
                type: "matching",
                items: [
                    { id: "1", text: "Send Money" },
                    { id: "2", text: "Request Money" },
                    { id: "3", text: "Scan & Pay" }
                ],
                matches: [
                    { id: "a", text: "Transfer funds to other UPI IDs" },
                    { id: "b", text: "Ask for payments from other BHIM users" },
                    { id: "c", text: "Make payments using QR codes" }
                ],
                correctMatches: { "1": "a", "2": "b", "3": "c" },
                explanation: "BHIM app offers various features for easy money transfers and payments."
            },
            // ... (more BHIM questions)
        ]
    },
    eKYC: {
        title: "eKYC",
        description: "Learn about electronic Know Your Customer (eKYC)",
        points: 300,
        questions: [
            {
                _id: "ekyc_1",
                title: "eKYC Basics",
                description: "Understand the concept of eKYC.",
                points: 50,
                type: "true_false",
                question: "eKYC allows for paperless verification of customer identity and address.",
                answer: true,
                explanation: "eKYC enables digital verification of customer information, eliminating the need for physical documents."
            },
            {
                _id: "ekyc_2",
                title: "eKYC Process",
                description: "Learn about the eKYC process steps.",
                points: 60,
                type: "ordering",
                items: [
                    { id: "1", text: "Customer provides Aadhaar number" },
                    { id: "2", text: "OTP verification" },
                    { id: "3", text: "Biometric authentication" },
                    { id: "4", text: "UIDAI server verification" },
                    { id: "5", text: "KYC data shared with service provider" }
                ],
                correctOrder: ["1", "2", "3", "4", "5"],
                explanation: "The eKYC process typically follows these steps to verify and share customer information securely."
            },
            // ... (more eKYC questions)
        ]
    },
    DBT: {
        title: "Direct Benefit Transfer (DBT)",
        description: "Learn about India's Direct Benefit Transfer system",
        points: 400,
        questions: [
            {
                _id: "dbt_1",
                title: "DBT Basics",
                description: "Understand the fundamentals of DBT.",
                points: 50,
                type: "multiple_choice",
                question: "What is the primary purpose of Direct Benefit Transfer (DBT)?",
                options: [
                    { id: "opt1", text: "To transfer benefits directly to citizens' bank accounts", correct: true },
                    { id: "opt2", text: "To collect taxes from citizens", correct: false },
                    { id: "opt3", text: "To provide loans to businesses", correct: false }
                ],
                explanation: "DBT aims to transfer government benefits and subsidies directly into the bank accounts of the beneficiaries, reducing delays and leakages."
            },
            {
                _id: "dbt_2",
                title: "DBT and Aadhaar",
                description: "Learn about the connection between DBT and Aadhaar.",
                points: 60,
                type: "true_false",
                question: "Aadhaar is mandatory for all DBT schemes.",
                answer: false,
                explanation: "While Aadhaar is used in many DBT schemes for identification and direct transfer, it is not mandatory for all DBT schemes as per Supreme Court rulings."
            },
            {
                _id: "dbt_3",
                title: "DBT Schemes",
                description: "Identify major schemes under DBT.",
                points: 70,
                type: "matching",
                items: [
                    { id: "1", text: "PAHAL" },
                    { id: "2", text: "MGNREGA" },
                    { id: "3", text: "PM-KISAN" }
                ],
                matches: [
                    { id: "a", text: "LPG Subsidy" },
                    { id: "b", text: "Rural Employment Guarantee" },
                    { id: "c", text: "Farmer Income Support" }
                ],
                correctMatches: { "1": "a", "2": "b", "3": "c" },
                explanation: "PAHAL is for LPG subsidies, MGNREGA for rural employment, and PM-KISAN for farmer income support."
            },
            // ... (add more DBT questions)
        ]
    },
    
};


document.addEventListener('DOMContentLoaded', function () {
    initGame();
});

async function initGame() {
    try {
        await fetchUserProfile();
        await loadLeaderboard();
        loadQuestMap();
    } catch (error) {
        console.error('Error initializing game:', error);
        showNotification('There was an error loading the game. Please refresh the page and try again.', 'error');
    }
}

async function fetchUserProfile() {
    try {
        const response = await axios.get('/api/user_profile');
        userProfile = response.data;
        updateProfile();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        showNotification('Failed to load user profile. Please try again later.', 'error');
    }
}

function updateProfile() {
    const profileContent = document.getElementById('profile-content');
    profileContent.innerHTML = `
        <p><strong>Name:</strong> ${userProfile.name}</p>
        <p><strong>Level:</strong> ${userProfile.level}</p>
        <p><strong>Points:</strong> ${userProfile.points}</p>
        <p><strong>Rank:</strong> ${userProfile.rank}</p>
        <div class="mt-4">
            <div class="bg-blue-200 h-4 rounded-full">
                <div class="bg-blue-500 h-4 rounded-full" style="width: ${(userProfile.points % 100)}%;"></div>
            </div>
            <p class="text-sm text-gray-600 mt-1">Progress to next level: ${userProfile.points % 100}/100</p>
        </div>
        <div class="mt-4">
            <h3 class="font-bold">Badges:</h3>
            <div class="flex flex-wrap gap-2 mt-2">
                ${userProfile.badges.map(badge => `<span class="bg-yellow-400 text-yellow-900 px-2 py-1 rounded">${badge}</span>`).join('')}
            </div>
        </div>
    `;
}

async function loadLeaderboard() {
    const leaderboardContent = document.getElementById('leaderboard-content');
    try {
        const response = await axios.get('/api/leaderboard');
        const leaderboard = response.data;
        
        leaderboardContent.innerHTML = `
            <ol class="list-decimal list-inside">
                ${leaderboard.map((entry, index) => `
                    <li class="mb-2 ${index < 3 ? 'font-bold' : ''}">
                        ${entry.username} - ${entry.points} points
                        ${index === 0 ? '<i class="fas fa-crown text-yellow-400 ml-2"></i>' : ''}
                    </li>
                `).join('')}
            </ol>
        `;
        showNotification('Leaderboard loaded successfully', 'success');
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        leaderboardContent.innerHTML = `
            <p class="text-red-500">Unable to load leaderboard at this time.</p>
            <button onclick="loadLeaderboard()" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                Retry
            </button>
        `;
        showNotification('Failed to load leaderboard. Please try again later.', 'error');
    }
}

function loadQuestMap() {
    const mapContent = document.getElementById('map-content');
    
    mapContent.innerHTML = Object.entries(quests).map(([category, categoryData]) => `
        <div class="quest-category mb-4">
            <div class="quest-item bg-gray-200 p-4 rounded-lg text-center ${isQuestCompleted(category) ? 'bg-green-200' : ''} relative cursor-pointer hover:shadow-lg transition duration-300" onclick="startCategory('${category}')">
                <h3 class="font-bold">${categoryData.title}</h3>
                <p class="text-sm">${categoryData.points} points</p>
                <p class="text-xs mt-2">${categoryData.description}</p>
                ${isQuestCompleted(category) ? '<i class="fas fa-check-circle text-green-500 absolute top-2 right-2"></i>' : ''}
            </div>
        </div>
    `).join('');
}
function isQuestCompleted(category) {
    return quests[category].questions.every(question => userProfile.completedQuests.includes(question._id));
}

function startCategory(category) {
    currentCategory = category;
    currentQuestIndex = 0;
    startQuest();
}
function startQuest() {
    const currentQuest = quests[currentCategory].questions[currentQuestIndex];

    if (!currentQuest) {
        showNotification('You have completed all quests in this category!', 'success');
        loadQuestMap();
        return;
    }

    if (userProfile.completedQuests.includes(currentQuest._id)) {
        currentQuestIndex++;
        startQuest();
        return;
    }

    const questContent = document.getElementById('quest-content');
    const questOptions = document.getElementById('quest-options');
    const submitButton = document.getElementById('submit-answer');

    questContent.innerHTML = `
        <h3 class="text-2xl font-bold mb-2">${currentQuest.title}</h3>
        <p class="mb-4">${currentQuest.description || 'No description available'}</p>
        <p class="font-bold">${currentQuest.question || "Complete the following task:"}</p>
    `;

    questOptions.innerHTML = '';
    submitButton.classList.remove('hidden');

    switch (currentQuest.type) {
        case 'multiple_choice':
            renderMultipleChoice(currentQuest);
            break;
        case 'drag_and_drop':
            renderDragAndDrop(currentQuest);
            break;
        case 'ordering':
            renderOrdering(currentQuest);
            break;
        case 'true_false':
            renderTrueFalse(currentQuest);
            break;
        case 'multiple_select':
            renderMultipleSelect(currentQuest);
            break;
        case 'image_selection':
            renderImageSelection(currentQuest);
            break;
        case 'matching':
            renderMatching(currentQuest);
            break;
        case 'fill_in_the_blank':
            renderFillInTheBlank(currentQuest);
            break;
        default:
            questOptions.innerHTML = '<p class="text-red-500">Unknown quest type</p>';
    }
}
// ... (previous code remains the same)

function renderOrdering(quest) {
    const questOptions = document.getElementById('quest-options');
    questOptions.innerHTML = `
        <div id="ordering-items" class="space-y-2">
            ${quest.items.map(item => `
                <div id="order-${item.id}" class="bg-blue-100 p-2 rounded cursor-move" draggable="true" ondragstart="drag(event)">
                    ${item.text}
                </div>
            `).join('')}
        </div>
    `;

    questOptions.addEventListener('dragover', allowDrop);
    questOptions.addEventListener('drop', dropOrdering);
}

function dropOrdering(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const dropTarget = ev.target.closest('#ordering-items > div') || ev.target.closest('#ordering-items');
    
    if (dropTarget.id === 'ordering-items') {
        dropTarget.appendChild(draggedElement);
    } else {
        dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
    }
}

// General Drag and Drop fixes
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    var dropTarget = ev.target.closest('#slots > div, #items > div');

    if (dropTarget && dropTarget !== draggedElement) {
        if (dropTarget.children.length > 0) {
            // Swap the elements
            var temp = document.createElement('div');
            dropTarget.parentNode.insertBefore(temp, dropTarget);
            draggedElement.parentNode.insertBefore(dropTarget, draggedElement);
            temp.parentNode.insertBefore(draggedElement, temp);
            temp.parentNode.removeChild(temp);
        } else {
            // Move the dragged element to the new position
            dropTarget.appendChild(draggedElement);
        }
    }
}

// Matching type fixes
function renderMatching(quest) {
    const questOptions = document.getElementById('quest-options');
    questOptions.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            <div id="match-items" class="space-y-2">
                ${quest.items.map(item => `
                    <div id="item-${item.id}" class="bg-blue-100 p-2 rounded" draggable="true" ondragstart="dragMatching(event)" ondragover="allowDrop(event)" ondrop="dropMatching(event)">
                        ${item.text}
                    </div>
                `).join('')}
            </div>
            <div id="match-slots" class="space-y-2">
                ${quest.matches.map(match => `
                    <div id="slot-${match.id}" class="bg-gray-200 p-2 rounded min-h-[40px]" ondragover="allowDrop(event)" ondrop="dropMatching(event)">
                        ${match.text}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function dragMatching(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dropMatching(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const dropTarget = event.target.closest('#match-slots > div, #match-items > div');

    if (!dropTarget || dropTarget === draggedElement) return;

    if (dropTarget.children.length > 0) {
        // Swap the elements
        const draggedParent = draggedElement.parentNode;
        const dropParent = dropTarget.parentNode;
        const draggedNext = draggedElement.nextElementSibling;
        const dropNext = dropTarget.nextElementSibling;

        dropParent.insertBefore(draggedElement, dropNext);
        draggedParent.insertBefore(dropTarget, draggedNext);
    } else {
        // Move the dragged element to the new position
        dropTarget.appendChild(draggedElement);
    }
}

function checkMatching(quest) {
    const matchSlots = document.querySelectorAll('#match-slots > div');
    let correct = true;
    matchSlots.forEach(slot => {
        const slotId = slot.id.split('-')[1];
        const itemElement = slot.firstElementChild;
        if (itemElement) {
            const itemId = itemElement.id.split('-')[1];
            if (quest.correctMatches[itemId] !== slotId) {
                correct = false;
            }
        } else {
            correct = false; // If any slot is empty, it's incorrect
        }
    });
    return correct;
}

function checkOrdering(quest) {
    const orderedItems = Array.from(document.getElementById('ordering-items').children);
    const userOrder = orderedItems.map(item => item.id.split('-')[1]);
    return JSON.stringify(userOrder) === JSON.stringify(quest.correctOrder);
}



// ... (rest of the code remains the same)

function renderTrueFalse(quest) {
    const questOptions = document.getElementById('quest-options');
    questOptions.innerHTML = `
        <div class="space-x-4">
            <button id="true-btn" class="bg-blue-500 text-white px-4 py-2 rounded" onclick="selectTrueFalse('true')">True</button>
            <button id="false-btn" class="bg-blue-500 text-white px-4 py-2 rounded" onclick="selectTrueFalse('false')">False</button>
        </div>
    `;
}



function renderMultipleSelect(quest) {
    const questOptions = document.getElementById('quest-options');
    questOptions.innerHTML = quest.options.map(option => `
        <div class="mb-2">
            <input type="checkbox" id="option-${option.id}" name="multiselect" value="${option.id}">
            <label for="option-${option.id}">${option.text}</label>
        </div>
    `).join('');
}

function renderImageSelection(quest) {
    const questOptions = document.getElementById('quest-options');
    questOptions.innerHTML = quest.options.map(option => `
        <div class="inline-block m-2">
            <img src="${option.imageUrl}" alt="Option ${option.id}" class="w-32 h-32 object-cover cursor-pointer" 
                onclick="selectImage('${option.id}')">
        </div>
    `).join('');
}


function renderFillInTheBlank(quest) {
    const questOptions = document.getElementById('quest-options');
    questOptions.innerHTML = `
        <div class="mb-4">
            <input type="text" id="fill-blank-answer" class="border-2 border-gray-300 p-2 rounded" placeholder="Type your answer here">
        </div>
    `;
}
function selectTrueFalse(answer) {
    const trueBtn = document.getElementById('true-btn');
    const falseBtn = document.getElementById('false-btn');
    trueBtn.classList.remove('bg-green-500');
    falseBtn.classList.remove('bg-green-500');
    if (answer === 'true') {
        trueBtn.classList.add('bg-green-500');
    } else {
        falseBtn.classList.add('bg-green-500');
    }
}




function checkAnswer() {
    const currentQuest = quests[currentCategory].questions[currentQuestIndex];
    let correct = false;

    switch (currentQuest.type) {
        case 'multiple_choice':
            correct = checkMultipleChoice(currentQuest);
            break;
        case 'drag_and_drop':
            correct = checkDragAndDrop(currentQuest);
            break;
        case 'ordering':
            correct = checkOrdering(currentQuest);
            break;
        case 'true_false':
            correct = checkTrueFalse(currentQuest);
            break;
        case 'multiple_select':
            correct = checkMultipleSelect(currentQuest);
            break;
        case 'image_selection':
            correct = checkImageSelection(currentQuest);
            break;
        case 'matching':
            correct = checkMatching(currentQuest);
            break;
        case 'fill_in_the_blank':
            correct = checkFillInTheBlank(currentQuest);
            break;
    }

    if (correct) {
        handleCorrectAnswer(currentQuest);
    } else {
        handleIncorrectAnswer();
    }
}
function checkOrdering(quest) {
    const orderedItems = Array.from(document.getElementById('ordering-items').children);
    const userOrder = orderedItems.map(item => item.id.split('-')[1]);
    return JSON.stringify(userOrder) === JSON.stringify(quest.correctOrder);
}

function checkTrueFalse(quest) {
    const selectedAnswer = document.querySelector('#true-btn.bg-green-500') ? 'true' : 'false';
    return selectedAnswer === quest.answer.toString();
}



function checkMultipleSelect(quest) {
    const selectedOptions = Array.from(document.querySelectorAll('input[name="multiselect"]:checked'))
        .map(input => input.value);
    const correctOptions = quest.options.filter(option => option.correct).map(option => option.id);
    return JSON.stringify(selectedOptions.sort()) === JSON.stringify(correctOptions.sort());
}

function checkImageSelection(quest) {
    const selectedImage = document.querySelector('#quest-options img.border-green-500');
    return selectedImage && selectedImage.getAttribute('onclick').includes(quest.correctOption);
}



function checkFillInTheBlank(quest) {
    const userAnswer = document.getElementById('fill-blank-answer').value.trim().toLowerCase();
    return userAnswer === quest.answer.toLowerCase();
}

async function handleCorrectAnswer(quest) {
    try {
        const response = await axios.post('/api/complete_challenge', {
            challenge_id: quest._id,
            points_earned: quest.points
        });
        userProfile.points = response.data.total_points;
        userProfile.completedQuests.push(quest._id);
        updateProfile();
        showNotification(`Correct! ${quest.explanation}`, 'success');
        currentQuestIndex++;
        setTimeout(() => startQuest(), 2000);
    } catch (error) {
        console.error('Error completing challenge:', error);
        showNotification('An error occurred while saving your progress. Please try again.', 'error');
    }
}

function handleIncorrectAnswer() {
    showNotification('Incorrect answer. Try again!', 'error');
}

function renderMultipleChoice(quest) {
    const questOptions = document.getElementById('quest-options');
    
    questOptions.innerHTML = '';
    
    quest.options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.id = `option-${option.id}`;
        optionButton.textContent = option.text;
        optionButton.className = 'option-btn bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full hover:bg-blue-600 transition duration-300';
        
        optionButton.addEventListener('click', () => selectOption(option.id));
        
        questOptions.appendChild(optionButton);
    });
}

function renderDragAndDrop(quest) {
    const questOptions = document.getElementById('quest-options');
    questOptions.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            <div id="items" class="border p-4">
                ${quest.items.map(item => `
                    <div id="item-${item.id}" draggable="true" ondragstart="drag(event)" class="bg-blue-200 p-2 mb-2 cursor-move">
                        ${item.text}
                    </div>
                `).join('')}
            </div>
            <div id="slots" class="border p-4">
                ${quest.slots.map(slot => `
                    <div id="slot-${slot.id}" ondrop="drop(event)" ondragover="allowDrop(event)" class="bg-gray-200 p-2 mb-2 min-h-[40px]">
                        ${slot.label}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function selectOption(optionId) {
    const currentQuest = quests[currentCategory].questions[currentQuestIndex];
    currentQuest.options.forEach(option => {
        const button = document.getElementById(`option-${option.id}`);
        if (option.id === optionId) {
            button.classList.remove('bg-blue-500');
            button.classList.add('bg-green-500');
        } else {
            button.classList.remove('bg-green-500');
            button.classList.add('bg-blue-500');
        }
    });
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

async function submitAnswer() {
    const currentQuest = quests[currentCategory].questions[currentQuestIndex];
    let correct = checkAnswer(); // Use the checkAnswer() function here

    if (correct) {
        try {
            const response = await axios.post('/api/complete_challenge', {
                challenge_id: currentQuest._id,
                points_earned: currentQuest.points
            });
            userProfile.points = response.data.total_points;
            userProfile.completedQuests.push(currentQuest._id);
            updateProfile();
            showNotification(`Correct! ${currentQuest.explanation}`, 'success');
            currentQuestIndex++;
            setTimeout(() => startQuest(), 2000);
        } catch (error) {
            console.error('Error completing challenge:', error);
            showNotification('An error occurred while saving your progress. Please try again.', 'error');
        }
    } else {
        showNotification('Incorrect answer. Try again!', 'error');
    }
}

function checkMultipleChoice(quest) {
    const selectedOptionElement = document.querySelector('#quest-options .bg-green-500');
    if (!selectedOptionElement) {
        return false; // No option selected
    }
    const selectedOptionId = selectedOptionElement.id.split('-')[1];
    const selectedOption = quest.options.find(option => option.id === selectedOptionId);
    return selectedOption && selectedOption.correct;
}

function checkDragAndDrop(quest) {
    const slots = document.querySelectorAll('#slots > div');
    let correct = true;
    slots.forEach(slot => {
        const slotId = slot.id.split('-')[1];
        const itemIds = Array.from(slot.children).map(child => child.id.split('-')[1]);
        const correctItems = quest.correctPlacements[slotId];
        if (!itemIds.every(id => correctItems.includes(id)) || itemIds.length !== correctItems.length) {
            correct = false;
        }
    });
    return correct;
}

function resetDragAndDrop() {
    const items = document.querySelectorAll('#items > div');
    const itemsContainer = document.getElementById('items');
    items.forEach(item => {
        itemsContainer.appendChild(item);
    });
}


function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white`;
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}

async function checkAuthentication() {
    try {
        await axios.get('/api/check_auth');
    } catch (error) {
        window.location.href = '/signin';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initGame();
});

document.getElementById('submit-answer').addEventListener('click', submitAnswer);