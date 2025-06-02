export default function DOMController(player, ai) {
    const playerBoardDiv = document.getElementById('player-board');
    const aiBoardDiv = document.getElementById('ai-board');
    const aiBoardSection = document.getElementById('ai-board-section');
    const rotateBtn = document.getElementById('rotate-btn');
    const turnIndicator = document.getElementById('turn-indicator');
    const playerLabel = document.getElementById('player-label');
    const winnerText = document.getElementById('winner-text');
    const resultBox = document.getElementById('result');
    const startBattleBtn = document.getElementById('start-battle-btn');

    let axis = 'x';
    let placing = true;
    let shipsToPlace = [5, 4, 3, 3, 2];

    function createBoard(boardDiv, board, isAI = false) {
        boardDiv.innerHTML = '';

        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.x = x;
                cell.dataset.y = y;

                if (!isAI && typeof board[y][x] === 'object' && board[y][x] !== null) cell.classList.add('ship');

                if (board[y][x] === 'hit') cell.classList.add('hit');
                if (board[y][x] === 'miss') cell.classList.add('miss');

                boardDiv.appendChild(cell);
            }
        }
    }

    function render() {
        createBoard(playerBoardDiv, player.gameboard.board);
        createBoard(aiBoardDiv, ai.gameboard.board, true);
    }

    function handlePlaceShip(e) {
        if (!placing || !e.target.classList.contains('cell')) return;

        const x = +e.target.dataset.x;
        const y = +e.target.dataset.y;
        const length = shipsToPlace[0];

        if (player.gameboard.placeShip(x, y, length, axis)) {
            shipsToPlace.shift();
            render();
        }

        if (shipsToPlace.length === 0) {
            placing = false;
            playerBoardDiv.removeEventListener('click', handlePlaceShip);
            aiAutoPlace();
            startBattleBtn.classList.remove('hidden');
        }
    }

    function aiAutoPlace() {
        const lengths = [5, 4, 3, 3, 2];
        lengths.forEach(length => {
            let placed = false;
            while (!placed) {
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);
                const axis = Math.random() > 0.5 ? 'x' : 'y';
                placed = ai.gameboard.placeShip(x, y, length, axis);
            }
        });
    }

    function handleAttack(e) {
        if (placing || !e.target.classList.contains('cell')) return;
        if (e.target.classList.contains('hit') || e.target.classList.contains('miss')) return;

        const x = +e.target.dataset.x;
        const y = +e.target.dataset.y;
        const result = player.attack(ai.gameboard, x, y);
        render();

        if (ai.gameboard.allShipsSunk()) return endGame(`${player.name} Wins!`);

        turnIndicator.textContent = `Enemy's Turn`;

        setTimeout(() => {
            let res;
            do {
                const [xi, yi] = ai.getRandomMove();
                res = ai.attack(player.gameboard, xi, yi);
            } while (res === 'already attacked');
            render();

            if (player.gameboard.allShipsSunk()) return endGame(`Enemy Wins!`);

            turnIndicator.textContent = `${player.name}'s Turn`;
        }, 800);
    }

    function endGame(winner) {
        resultBox.classList.remove('hidden');
        winnerText.textContent = winner;
        aiBoardDiv.removeEventListener('click', handleAttack);
    }

    function setup() {
        playerLabel.textContent = player.name;
        render();
        playerBoardDiv.addEventListener('click', handlePlaceShip);
        rotateBtn.classList.remove('hidden');
        rotateBtn.addEventListener('click', () => {
            axis = axis === 'x' ? 'y' : 'x';
            rotateBtn.textContent = `Rotate: ${axis.toUpperCase()}`;
        });

        startBattleBtn.addEventListener('click', () => {
            rotateBtn.classList.add('hidden');
            aiBoardSection.classList.remove('hidden');
            startBattleBtn.classList.add('hidden');
            turnIndicator.textContent = `${player.name}'s Turn`;
            aiBoardDiv.addEventListener('click', handleAttack);
        });
    }

    return { setup };
}