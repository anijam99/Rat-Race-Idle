// Game state
let gameState = {
    ratName: 'Squeaky',
    age: 0,
    speed: 1,
    stamina: 10,
    combat: 1,
    survival: 1,
    cheese: 0,
    raceWins: 0,
    speedMultiplier: 1,
    staminaMultiplier: 1,
    upgrades: {
        wheel: false,
        protein: false,
        nest: false
    },
    eventCooldown: 0
};

// Random events
const randomEvents = [
    {
        name: "Cat Encounter!",
        description: "A hungry cat blocks your path! What do you do?",
        choices: [
            {
                text: "🥊 Fight the cat",
                requirements: { combat: 3 },
                success: { combat: 2, cheese: 10 },
                failure: { stamina: -5 },
                successText: "You scratched the cat and found its food stash!",
                failureText: "The cat swatted you away. You're hurt but alive."
            },
            {
                text: "🏃 Run away quickly",
                requirements: { speed: 4 },
                success: { survival: 1 },
                failure: { stamina: -3 },
                successText: "You escaped and learned valuable survival skills!",
                failureText: "You barely escaped, exhausted from the chase."
            }
        ]
    },
    {
        name: "Cheese Vault Discovery!",
        description: "You found an old mouse trap with cheese still in it!",
        choices: [
            {
                text: "🧠 Carefully disarm the trap",
                requirements: { survival: 3 },
                success: { cheese: 25, survival: 1 },
                failure: { stamina: -8 },
                successText: "You safely retrieved a huge chunk of cheese!",
                failureText: "SNAP! The trap got you, but you survived."
            },
            {
                text: "💨 Rush in and grab it",
                requirements: { speed: 6 },
                success: { cheese: 15 },
                failure: { stamina: -5 },
                successText: "Lightning fast! You grabbed the cheese before the trap triggered!",
                failureText: "Too slow! The trap snapped but you got a small piece."
            }
        ]
    },
    {
        name: "Underground Race Challenge!",
        description: "A veteran racer challenges you to an impromptu race!",
        choices: [
            {
                text: "🏁 Accept the challenge",
                requirements: { speed: 8, stamina: 20 },
                success: { cheese: 50, raceWins: 1, speed: 1 },
                failure: { stamina: -10 },
                successText: "Victory! You won cheese and gained racing experience!",
                failureText: "You lost but learned something about racing technique."
            },
            {
                text: "📚 Decline and ask for training tips",
                requirements: { survival: 2 },
                success: { speed: 2, stamina: 5 },
                failure: {},
                successText: "The veteran shared valuable training secrets!",
                failureText: "They weren't in a sharing mood today."
            }
        ]
    }
];

// Core training actions
function trainSpeed() {
    gameState.speed += gameState.speedMultiplier;
    gameState.stamina = Math.max(0, gameState.stamina - 1);
    addEvent(`Trained speed! Now at ${gameState.speed} mph.`);
    updateDisplay();
}

function trainStamina() {
    gameState.stamina += 2 * gameState.staminaMultiplier;
    addEvent(`Built stamina! Now at ${gameState.stamina}.`);
    updateDisplay();
}

function scavenge() {
    const found = Math.floor(Math.random() * 3) + 1;
    gameState.cheese += found;
    gameState.survival += Math.random() < 0.1 ? 1 : 0; // 10% chance to gain survival
    gameState.stamina = Math.max(0, gameState.stamina - 2);
    addEvent(`Scavenged and found ${found} cheese!`);
    updateDisplay();
}

function enterRace() {
    if (gameState.speed < 5 || gameState.stamina < 10) return;
    
    const raceSuccess = Math.random() < (gameState.speed / (gameState.speed + 10));
    gameState.stamina -= 10;
    
    if (raceSuccess) {
        const prize = Math.floor(Math.random() * 20) + 10;
        gameState.cheese += prize;
        gameState.raceWins++;
        gameState.speed += 1;
        addEvent(`🏆 Won the race! Earned ${prize} cheese and experience!`);
    } else {
        const consolation = Math.floor(Math.random() * 5) + 1;
        gameState.cheese += consolation;
        addEvent(`Lost the race but earned ${consolation} cheese for participating.`);
    }
    
    updateDisplay();
}

// Upgrade functions
function buyWheel() {
    if (gameState.cheese >= 50 && !gameState.upgrades.wheel) {
        gameState.cheese -= 50;
        gameState.upgrades.wheel = true;
        gameState.speedMultiplier *= 2;
        addEvent("Bought an exercise wheel! Speed training is now 2x more effective!");
        updateDisplay();
    }
}

function buyProtein() {
    if (gameState.cheese >= 100 && !gameState.upgrades.protein) {
        gameState.cheese -= 100;
        gameState.upgrades.protein = true;
        gameState.staminaMultiplier *= 2;
        addEvent("Bought protein pellets! Stamina training is now 2x more effective!");
        updateDisplay();
    }
}

function buyNest() {
    if (gameState.cheese >= 200 && !gameState.upgrades.nest) {
        gameState.cheese -= 200;
        gameState.upgrades.nest = true;
        addEvent("Built a better nest! You now regenerate stamina over time!");
        updateDisplay();
    }
}

// Event system
function addEvent(text) {
    const eventLog = document.getElementById('event-log');
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event';
    eventDiv.textContent = text;
    eventLog.insertBefore(eventDiv, eventLog.firstChild);
    
    // Keep only last 10 events
    while (eventLog.children.length > 10) {
        eventLog.removeChild(eventLog.lastChild);
    }
}

function triggerRandomEvent() {
    if (gameState.eventCooldown > 0) return;
    
    const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    const eventDiv = document.getElementById('current-event');
    const descDiv = document.getElementById('event-description');
    const choicesDiv = document.getElementById('event-choices');
    
    descDiv.textContent = event.description;
    choicesDiv.innerHTML = '';
    
    event.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        
        // Check if player meets requirements
        const meetsReqs = Object.entries(choice.requirements).every(([stat, required]) => 
            gameState[stat] >= required
        );
        
        button.disabled = !meetsReqs;
        if (!meetsReqs) {
            button.textContent += ` (Need: ${Object.entries(choice.requirements)
                .map(([stat, val]) => `${stat} ${val}`).join(', ')})`;
        }
        
        button.onclick = () => resolveEventChoice(event, choice, index);
        choicesDiv.appendChild(button);
    });
    
    eventDiv.style.display = 'block';
    gameState.eventCooldown = 30; // 30 second cooldown
}

function resolveEventChoice(event, choice, choiceIndex) {
    const meetsReqs = Object.entries(choice.requirements).every(([stat, required]) => 
        gameState[stat] >= required
    );
    
    const isSuccess = meetsReqs && Math.random() < 0.7; // 70% success rate if requirements met
    const outcome = isSuccess ? choice.success : choice.failure;
    const message = isSuccess ? choice.successText : choice.failureText;
    
    // Apply outcome
    Object.entries(outcome).forEach(([stat, change]) => {
        if (stat === 'stamina') {
            gameState[stat] = Math.max(0, gameState[stat] + change);
        } else {
            gameState[stat] += change;
        }
    });
    
    addEvent(`${event.name} - ${message}`);
    document.getElementById('current-event').style.display = 'none';
    updateDisplay();
}

// Main game loop
function gameLoop() {
    gameState.age += 1;
    
    // Passive stamina regen from nest
    if (gameState.upgrades.nest) {
        gameState.stamina += 2;
    }
    
    // Natural stamina decay
    if (gameState.age % 5 === 0) {
        gameState.stamina = Math.max(0, gameState.stamina - 1);
    }
    
    // Event cooldown
    if (gameState.eventCooldown > 0) {
        gameState.eventCooldown--;
    }
    
    // Random events (5% chance per loop if no cooldown)
    if (gameState.eventCooldown === 0 && Math.random() < 0.05) {
        triggerRandomEvent();
    }
    
    updateDisplay();
}

// Update display
function updateDisplay() {
    document.getElementById('rat-name').textContent = gameState.ratName;
    document.getElementById('age').textContent = gameState.age;
    document.getElementById('speed').textContent = gameState.speed;
    document.getElementById('stamina').textContent = gameState.stamina;
    document.getElementById('combat').textContent = gameState.combat;
    document.getElementById('survival').textContent = gameState.survival;
    document.getElementById('cheese').textContent = gameState.cheese;
    document.getElementById('race-wins').textContent = gameState.raceWins;
    
    // Update button states
    document.getElementById('race-btn').disabled = gameState.speed < 5 || gameState.stamina < 10;
    document.getElementById('wheel-btn').disabled = gameState.cheese < 50 || gameState.upgrades.wheel;
    document.getElementById('protein-btn').disabled = gameState.cheese < 100 || gameState.upgrades.protein;
    document.getElementById('nest-btn').disabled = gameState.cheese < 200 || gameState.upgrades.nest;
    
    // Update upgrade button text if owned
    if (gameState.upgrades.wheel) {
        document.getElementById('wheel-btn').textContent = '🎡 Exercise Wheel - OWNED';
    }
    if (gameState.upgrades.protein) {
        document.getElementById('protein-btn').textContent = '🥜 Protein Pellets - OWNED';
    }
    if (gameState.upgrades.nest) {
        document.getElementById('nest-btn').textContent = '🏠 Better Nest - OWNED';
    }
}

// Save/Load functions
function saveGame() {
    localStorage.setItem('ratRaceIdle', JSON.stringify(gameState));
    addEvent('Game saved!');
}

function loadGame() {
    const saved = localStorage.getItem('ratRaceIdle');
    if (saved) {
        gameState = JSON.parse(saved);
        updateDisplay();
        addEvent('Game loaded!');
    } else {
        addEvent('No saved game found!');
    }
}

function resetGame() {
    if (confirm('Are you sure you want to reset your rat?')) {
        gameState = {
            ratName: 'Squeaky',
            age: 0,
            speed: 1,
            stamina: 10,
            combat: 1,
            survival: 1,
            cheese: 0,
            raceWins: 0,
            speedMultiplier: 1,
            staminaMultiplier: 1,
            upgrades: {
                wheel: false,
                protein: false,
                nest: false
            },
            eventCooldown: 0
        };
        document.getElementById('event-log').innerHTML = '<div class="event">Welcome to the underground! Start training your rat.</div>';
        updateDisplay();
    }
}

// Initialize game
window.onload = function() {
    updateDisplay();
    // Game loop runs every 3 seconds
    setInterval(gameLoop, 3000);
};