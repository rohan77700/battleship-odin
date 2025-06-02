import Ship from './ship.js';

export default class Gameboard {
    constructor() {
        this.board = Array(10)
        .fill(null)
        .map(() => Array(10).fill(null));
        this.ships = [];
        this.missedAttacks = [];
    }

    placeShip(x, y, length, axis = 'x') {
        const ship = new Ship(length);
        const coords = [];

        for (let i = 0; i < length; i++) {
            const xi = axis === 'x' ? x + i : x;
            const yi = axis === 'y' ? y + i : y;

            if (xi > 9 || yi > 9 || this.board[yi][xi] !== null) {
                return false; // Invalid placement
            }

            coords.push([xi, yi]);
        }

        coords.forEach(([xi, yi]) => {
            this.board[yi][xi] = ship;
        });

        this.ships.push(ship);
        return true;
    }

    receiveAttack(x, y) {
        const cell = this.board[y][x];
        
        if (cell === null) {
            this.missedAttacks.push([x, y]);
            this.board[y][x] = 'miss';
            return 'miss';
        } else if (cell instanceof Ship) {
            cell.hit();
            this.board[y][x] = 'hit';
            return 'hit';
        } else {
            return 'already attacked';
        }
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }

    getMissedAttacks() {
        return this.missedAttacks;
    }
}