import { gameState } from './gamestate.js';
import { addEvent, updateDisplay } from './ui.js';

export function enterRace() {
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