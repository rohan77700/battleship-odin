import Player from './modules/player.js';
import DOMController from './modules/dom.js';

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

startBtn.addEventListener('click', () => {
    const name = document.getElementById('player-name').value || 'Captain';
    const player = new Player(name);
    const ai = new Player('Enemy');

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    const dom = DOMController(player, ai);
    dom.setup();
});

restartBtn.addEventListener('click', () => {
    window.location.reload();
});