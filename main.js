import { gameState } from './gamestate.js';
import { updateTime } from './time.js';
import { addEvent, updateDisplay } from './ui.js';
import { trainSpeed, trainStamina, scavenge } from './training.js';
import { enterRace } from './race.js';
import { buyWheel, buyProtein, buyNest } from './upgrades.js';
import { triggerRandomEvent } from './events.js';
import { saveGame, loadGame, resetGame } from './saveload.js';

function gameLoop() {
    gameState.age++;
    
    updateTime(addEvent);

    if (gameState.upgrades.nest) {
        gameState.stamina += 2;
    }
    
    if (gameState.age % 5 === 0) {
        gameState.stamina = Math.max(0, gameState.stamina - 1);
    }
    
    if (gameState.eventCooldown > 0) {
        gameState.eventCooldown--;
    }
    
    if (gameState.eventCooldown === 0 && Math.random() < 0.05) {
        triggerRandomEvent();
    }
    
    updateDisplay();
}

window.onload = function() {
    document.getElementById('train-speed-btn').onclick = trainSpeed;
    document.getElementById('train-stamina-btn').onclick = trainStamina;
    document.getElementById('scavenge-btn').onclick = scavenge;
    document.getElementById('race-btn').onclick = enterRace;
    
    document.getElementById('wheel-btn').onclick = buyWheel;
    document.getElementById('protein-btn').onclick = buyProtein;
    document.getElementById('nest-btn').onclick = buyNest;

    document.getElementById('save-btn').onclick = saveGame;
    document.getElementById('load-btn').onclick = loadGame;
    document.getElementById('reset-btn').onclick = resetGame;

    loadGame();
    updateDisplay();
    setInterval(gameLoop, 1000); // Game loop runs every second now
};