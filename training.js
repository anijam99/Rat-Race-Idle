import { gameState } from './gamestate.js';
import { addEvent, updateDisplay } from './ui.js';

export function trainSpeed() {
    gameState.speed += gameState.speedMultiplier;
    gameState.stamina = Math.max(0, gameState.stamina - 1);
    addEvent(`Trained speed! Now at ${gameState.speed} mph.`);
    updateDisplay();
}

export function trainStamina() {
    gameState.stamina += 2 * gameState.staminaMultiplier;
    addEvent(`Built stamina! Now at ${gameState.stamina}.`);
    updateDisplay();
}

export function scavenge() {
    const found = Math.floor(Math.random() * 3) + 1;
    gameState.cheese += found;
    gameState.survival += Math.random() < 0.1 ? 1 : 0;
    gameState.stamina = Math.max(0, gameState.stamina - 2);
    addEvent(`Scavenged and found ${found} cheese!`);
    updateDisplay();
}