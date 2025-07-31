import { gameState } from './gamestate.js';
import { time } from './time.js';

export function addEvent(text) {
    const eventLog = document.getElementById('event-log');
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event';
    eventDiv.textContent = text;
    eventLog.insertBefore(eventDiv, eventLog.firstChild);
    
    while (eventLog.children.length > 10) {
        eventLog.removeChild(eventLog.lastChild);
    }
}

export function updateDisplay() {
    document.getElementById('time-display').textContent = `${time.totalSeconds}s`;
    document.getElementById('day-night-display').textContent = time.isDay ? 'Day' : 'Night';
    
    document.getElementById('rat-name').textContent = gameState.ratName;
    document.getElementById('age').textContent = gameState.age;
    document.getElementById('speed').textContent = gameState.speed;
    document.getElementById('stamina').textContent = gameState.stamina;
    document.getElementById('combat').textContent = gameState.combat;
    document.getElementById('survival').textContent = gameState.survival;
    document.getElementById('cheese').textContent = gameState.cheese;
    document.getElementById('race-wins').textContent = gameState.raceWins;
    
    document.getElementById('race-btn').disabled = gameState.speed < 5 || gameState.stamina < 10;
    document.getElementById('wheel-btn').disabled = gameState.cheese < 50 || gameState.upgrades.wheel;
    document.getElementById('protein-btn').disabled = gameState.cheese < 100 || gameState.upgrades.protein;
    document.getElementById('nest-btn').disabled = gameState.cheese < 200 || gameState.upgrades.nest;
    
    if (gameState.upgrades.wheel) document.getElementById('wheel-btn').textContent = '🎡 Exercise Wheel - OWNED';
    if (gameState.upgrades.protein) document.getElementById('protein-btn').textContent = '🥜 Protein Pellets - OWNED';
    if (gameState.upgrades.nest) document.getElementById('nest-btn').textContent = '🏠 Better Nest - OWNED';
}