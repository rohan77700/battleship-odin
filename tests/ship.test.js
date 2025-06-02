import Ship from '../src/modules/ship.js';

describe('Ship', () => {
    test('Ship is created with correct length and 0 hits', () => {
        const ship = new Ship(4);
        expect(ship.length).toBe(4);
        expect(ship.hits).toBe(0);
    });

    test('Ship registers hits correctly', () => {
        const ship = new Ship(3);
        ship.hit();
        expect(ship.hits).toBe(1);
        ship.hit();
        expect(ship.hits).toBe(2);
    });

    test('Ship is not sunk until hits equal length', () => {
        const ship = new Ship(2);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });

    test('Ship cannot register hits after being sunk', () => {
        const ship = new Ship(1);
        ship.hit();
        ship.hit();
        expect(ship.hits).toBe(1); // should not increase beyond length
    });
});