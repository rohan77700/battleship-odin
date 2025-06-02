import Player from '../src/modules/player';
import Gameboard from '../src/modules/gameboard';

describe('Player', () => {
    let player, ai, enemyBoard;

    beforeEach(() => {
        player = new Player('Captain');
        ai = new Player();
        enemyBoard = new Gameboard();
    });

    test('Player has a name and gameboard', () => {
        expect(player.name).toBe('Captain');
        expect(player.gameboard).toBeInstanceOf(Gameboard);
    });

    test('Player can attack another gameboard', () => {
        enemyBoard.placeShip(0, 0, 1);
        expect(player.attack(enemyBoard, 0, 0)).toBe('hit');
    });

    test('AI performs random valid attacks', () => {
        const result = ai.makeMove(enemyBoard);
        expect(['hit', 'miss']).toContain(result.result);
    });

    test('AI does not repeat the same move', () => {
        const move1 = ai.getRandomMove();
        ai.previousMoves.add(`${move1[0]},${move1[1]}`);
        const move2 = ai.getRandomMove();
        expect(move2).not.toEqual(move1);
    });

    test('AI adds adjacent cells to queue on hit', () => {
        enemyBoard.placeShip(5, 5, 1);
        const result = ai.makeMove(enemyBoard);

        if (result.x === 5 && result.y === 5) {
            expect(result.result).toBe('hit');
            expect(ai.hitQueue.length).toBeGreaterThan(0);
        }
    });

    test('AI clears queue if no more targets', () => {
        for (let i = 0; i < 10; i++) {
            ai.makeMove(enemyBoard);
        }
        expect(ai.hitQueue.length).toBe(0);
    });
});