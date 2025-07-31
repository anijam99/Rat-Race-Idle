import { gameState } from './gamestate.js';
import { addEvent, updateDisplay } from './ui.js';

export function buyWheel() {
    if (gameState.cheese >= 50 && !gameState.upgrades.wheel) {
        gameState.cheese -= 50;
        gameState.upgrades.wheel = true;
        gameState.speedMultiplier *= 2;
        addEvent("Bought an exercise wheel! Speed training is now 2x more effective!");
        updateDisplay();
    }
}

export function buyProtein() {
    if (gameState.cheese >= 100 && !gameState.upgrades.protein) {
        gameState.cheese -= 100;
        gameState.upgrades.protein = true;
        gameState.staminaMultiplier *= 2;
        addEvent("Bought protein pellets! Stamina training is now 2x more effective!");
        updateDisplay();
    }
}

export function buyNest() {
    if (gameState.cheese >= 200 && !gameState.upgrades.nest) {
        gameState.cheese -= 200;
        gameState.upgrades.nest = true;
        addEvent("Built a better nest! You now regenerate stamina over time!");
        updateDisplay();
    }
}