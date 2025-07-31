import { gameState } from './gamestate.js';
import { addEvent, updateDisplay } from './ui.js';

export function saveGame() {
    localStorage.setItem('ratRaceIdle', JSON.stringify(gameState));
    addEvent('Game saved!');
}

export function loadGame() {
    const saved = localStorage.getItem('ratRaceIdle');
    if (saved) {
        Object.assign(gameState, JSON.parse(saved));
        updateDisplay();
        addEvent('Game loaded!');
    } else {
        addEvent('No saved game found!');
    }
}

export function resetGame() {
    if (confirm('Are you sure you want to reset your rat?')) {
        Object.assign(gameState, {
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
        });
        document.getElementById('event-log').innerHTML = '<div class="event">Welcome to the underground! Start training your rat.</div>';
        updateDisplay();
    }
}