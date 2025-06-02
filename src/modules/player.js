import Gameboard from './gameboard.js';

export default class Player {
    constructor(name = 'Enemy') {
        this.name = name;
        this.gameboard = new Gameboard();
        this.previousMoves = new Set();
        this.hitQueue = [];
        this.hits = [];
        this.currentDirection = null;
        this.directions = ['up', 'down', 'left', 'right'];
    }

    attack(opponentBoard, x, y) {
        return opponentBoard.receiveAttack(x, y);
    }

    isValidCoord(x, y) {
        return x >= 0 && x < 10 && y >= 0 && y < 10 && !this.previousMoves.has(`${x},${y}`);
    }

    getNextCoordInDirection([x, y], direction) {
        switch (direction) {
            case 'up': return [x, y - 1];
            case 'down': return [x, y + 1];
            case 'left': return [x - 1, y];
            case 'right': return [x + 1, y];
        }
    }

    getRandomMove() {
        let x, y;
        
        do {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        } while (this.previousMoves.has(`${x},${y}`));
        
        this.previousMoves.add(`${x},${y}`);
        return [x, y];
    }

    queueAdjacentCoords(x, y) {
        const adj = [
            [x, y - 1], [x, y + 1],
            [x - 1, y], [x + 1, y],
        ];
        
        for (const [nx, ny] of adj) {
            if (this.isValidCoord(nx, ny)) this.hitQueue.push([nx, ny]);
        }
    }

    makeMove(opponentBoard) {
        let x, y;

        if (this.hits.length > 0 && this.currentDirection) {
            const lastHit = this.hits[this.hits.length - 1];
            [x, y] = this.getNextCoordInDirection(lastHit, this.currentDirection);
            
            if (!this.isValidCoord(x, y)) {
                this.currentDirection = null;
                return this.makeMove(opponentBoard);
            }
        } else if (this.hitQueue.length > 0) {
            [x, y] = this.hitQueue.shift();
        } else {
            [x, y] = this.getRandomMove();
        }

        this.previousMoves.add(`${x},${y}`);
        const result = opponentBoard.receiveAttack(x, y);

        if (result === 'hit') {
            this.hits.push([x, y]);
            if (this.hits.length === 1) {
                this.queueAdjacentCoords(x, y);
            } else if (!this.currentDirection) {
                const [firstX, firstY] = this.hits[0];
                if (x === firstX) this.currentDirection = y > firstY ? 'down' : 'up';
                else if (y === firstY) this.currentDirection = x > firstX ? 'right' : 'left';
            }
        }

        if (result === 'miss' && this.currentDirection) {
            this.hits.reverse();
            this.currentDirection = this.reverseDirection(this.currentDirection);
        }

        if (result === 'sunk') {
            this.hitQueue = [];
            this.hits = [];
            this.currentDirection = null;
        }

        return { result, x, y };
    }

    reverseDirection(direction) {
        switch (direction) {
            case 'up': return 'down';
            case 'down': return 'up';
            case 'left': return 'right';
            case 'right': return 'left';
        }
    }
}