import Gameboard from '../src/modules/gameboard.js';

describe('Gameboard', () => {
    let board;

    beforeEach(() => {
        board = new Gameboard();
    });

    test('placeShip places ship horizontally', () => {
        expect(board.placeShip(0, 0, 3, 'x')).toBe(true);
    });

    test('placeShip places ship vertically', () => {
        expect(board.placeShip(0, 0, 3, 'y')).toBe(true);
    });

    test('placeShip fails if out of bounds or overlapping', () => {
        board.placeShip(8, 0, 3, 'x'); // overflow
        expect(board.placeShip(8, 0, 3, 'x')).toBe(false);
    });

    test('receiveAttack records hit correctly', () => {
        board.placeShip(0, 0, 2, 'x');
        expect(board.receiveAttack(0, 0)).toBe('hit');
        expect(board.receiveAttack(1, 0)).toBe('hit');
    });

    test('receiveAttack records miss correctly', () => {
        expect(board.receiveAttack(5, 5)).toBe('miss');
        expect(board.getMissedAttacks()).toContainEqual([5, 5]);
    });

    test('allShipsSunk returns true when all sunk', () => {
        board.placeShip(0, 0, 1);
        board.receiveAttack(0, 0);
        expect(board.allShipsSunk()).toBe(true);
    });

    test('receiveAttack handles repeat attacks', () => {
        board.receiveAttack(1, 1);
        expect(board.receiveAttack(1, 1)).toBe('already attacked');
    });
});