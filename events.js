import { gameState } from './gamestate.js';
import { addEvent, updateDisplay } from './ui.js';

const randomEvents = [
    // ... (Your randomEvents array remains the same)
];

export function triggerRandomEvent() {
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
    gameState.eventCooldown = 30;
}

function resolveEventChoice(event, choice, choiceIndex) {
    const meetsReqs = Object.entries(choice.requirements).every(([stat, required]) => 
        gameState[stat] >= required
    );
    
    const isSuccess = meetsReqs && Math.random() < 0.7;
    const outcome = isSuccess ? choice.success : choice.failure;
    const message = isSuccess ? choice.successText : choice.failureText;
    
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