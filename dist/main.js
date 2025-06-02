/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/player.js */ \"./src/modules/player.js\");\n/* harmony import */ var _modules_dom_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/dom.js */ \"./src/modules/dom.js\");\n\n\n\nconst startBtn = document.getElementById('start-btn');\nconst restartBtn = document.getElementById('restart-btn');\n\nstartBtn.addEventListener('click', () => {\n    const name = document.getElementById('player-name').value || 'Captain';\n    const player = new _modules_player_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](name);\n    const ai = new _modules_player_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]('Enemy');\n\n    document.getElementById('setup-screen').classList.add('hidden');\n    document.getElementById('game-screen').classList.remove('hidden');\n\n    const dom = (0,_modules_dom_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(player, ai);\n    dom.setup();\n});\n\nrestartBtn.addEventListener('click', () => {\n    window.location.reload();\n});\n\n//# sourceURL=webpack://battleship/./src/index.js?");

/***/ }),

/***/ "./src/modules/dom.js":
/*!****************************!*\
  !*** ./src/modules/dom.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DOMController)\n/* harmony export */ });\nfunction DOMController(player, ai) {\n    const playerBoardDiv = document.getElementById('player-board');\n    const aiBoardDiv = document.getElementById('ai-board');\n    const aiBoardSection = document.getElementById('ai-board-section');\n    const rotateBtn = document.getElementById('rotate-btn');\n    const turnIndicator = document.getElementById('turn-indicator');\n    const playerLabel = document.getElementById('player-label');\n    const winnerText = document.getElementById('winner-text');\n    const resultBox = document.getElementById('result');\n    const startBattleBtn = document.getElementById('start-battle-btn');\n\n    let axis = 'x';\n    let placing = true;\n    let shipsToPlace = [5, 4, 3, 3, 2];\n\n    function createBoard(boardDiv, board, isAI = false) {\n        boardDiv.innerHTML = '';\n\n        for (let y = 0; y < 10; y++) {\n            for (let x = 0; x < 10; x++) {\n                const cell = document.createElement('div');\n                cell.classList.add('cell');\n                cell.dataset.x = x;\n                cell.dataset.y = y;\n\n                if (!isAI && typeof board[y][x] === 'object' && board[y][x] !== null) cell.classList.add('ship');\n\n                if (board[y][x] === 'hit') cell.classList.add('hit');\n                if (board[y][x] === 'miss') cell.classList.add('miss');\n\n                boardDiv.appendChild(cell);\n            }\n        }\n    }\n\n    function render() {\n        createBoard(playerBoardDiv, player.gameboard.board);\n        createBoard(aiBoardDiv, ai.gameboard.board, true);\n    }\n\n    function handlePlaceShip(e) {\n        if (!placing || !e.target.classList.contains('cell')) return;\n\n        const x = +e.target.dataset.x;\n        const y = +e.target.dataset.y;\n        const length = shipsToPlace[0];\n\n        if (player.gameboard.placeShip(x, y, length, axis)) {\n            shipsToPlace.shift();\n            render();\n        }\n\n        if (shipsToPlace.length === 0) {\n            placing = false;\n            playerBoardDiv.removeEventListener('click', handlePlaceShip);\n            aiAutoPlace();\n            startBattleBtn.classList.remove('hidden');\n        }\n    }\n\n    function aiAutoPlace() {\n        const lengths = [5, 4, 3, 3, 2];\n        lengths.forEach(length => {\n            let placed = false;\n            while (!placed) {\n                const x = Math.floor(Math.random() * 10);\n                const y = Math.floor(Math.random() * 10);\n                const axis = Math.random() > 0.5 ? 'x' : 'y';\n                placed = ai.gameboard.placeShip(x, y, length, axis);\n            }\n        });\n    }\n\n    function handleAttack(e) {\n        if (placing || !e.target.classList.contains('cell')) return;\n        if (e.target.classList.contains('hit') || e.target.classList.contains('miss')) return;\n\n        const x = +e.target.dataset.x;\n        const y = +e.target.dataset.y;\n        const result = player.attack(ai.gameboard, x, y);\n        render();\n\n        if (ai.gameboard.allShipsSunk()) return endGame(`${player.name} Wins!`);\n\n        turnIndicator.textContent = `Enemy's Turn`;\n\n        setTimeout(() => {\n            let res;\n            do {\n                const [xi, yi] = ai.getRandomMove();\n                res = ai.attack(player.gameboard, xi, yi);\n            } while (res === 'already attacked');\n            render();\n\n            if (player.gameboard.allShipsSunk()) return endGame(`Enemy Wins!`);\n\n            turnIndicator.textContent = `${player.name}'s Turn`;\n        }, 800);\n    }\n\n    function endGame(winner) {\n        resultBox.classList.remove('hidden');\n        winnerText.textContent = winner;\n        aiBoardDiv.removeEventListener('click', handleAttack);\n    }\n\n    function setup() {\n        playerLabel.textContent = player.name;\n        render();\n        playerBoardDiv.addEventListener('click', handlePlaceShip);\n        rotateBtn.classList.remove('hidden');\n        rotateBtn.addEventListener('click', () => {\n            axis = axis === 'x' ? 'y' : 'x';\n            rotateBtn.textContent = `Rotate: ${axis.toUpperCase()}`;\n        });\n\n        startBattleBtn.addEventListener('click', () => {\n            rotateBtn.classList.add('hidden');\n            aiBoardSection.classList.remove('hidden');\n            startBattleBtn.classList.add('hidden');\n            turnIndicator.textContent = `${player.name}'s Turn`;\n            aiBoardDiv.addEventListener('click', handleAttack);\n        });\n    }\n\n    return { setup };\n}\n\n//# sourceURL=webpack://battleship/./src/modules/dom.js?");

/***/ }),

/***/ "./src/modules/gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/gameboard.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Gameboard)\n/* harmony export */ });\n/* harmony import */ var _ship_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship.js */ \"./src/modules/ship.js\");\n\n\nclass Gameboard {\n    constructor() {\n        this.board = Array(10)\n        .fill(null)\n        .map(() => Array(10).fill(null));\n        this.ships = [];\n        this.missedAttacks = [];\n    }\n\n    placeShip(x, y, length, axis = 'x') {\n        const ship = new _ship_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](length);\n        const coords = [];\n\n        for (let i = 0; i < length; i++) {\n            const xi = axis === 'x' ? x + i : x;\n            const yi = axis === 'y' ? y + i : y;\n\n            if (xi > 9 || yi > 9 || this.board[yi][xi] !== null) {\n                return false; // Invalid placement\n            }\n\n            coords.push([xi, yi]);\n        }\n\n        coords.forEach(([xi, yi]) => {\n            this.board[yi][xi] = ship;\n        });\n\n        this.ships.push(ship);\n        return true;\n    }\n\n    receiveAttack(x, y) {\n        const cell = this.board[y][x];\n        \n        if (cell === null) {\n            this.missedAttacks.push([x, y]);\n            this.board[y][x] = 'miss';\n            return 'miss';\n        } else if (cell instanceof _ship_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]) {\n            cell.hit();\n            this.board[y][x] = 'hit';\n            return 'hit';\n        } else {\n            return 'already attacked';\n        }\n    }\n\n    allShipsSunk() {\n        return this.ships.every(ship => ship.isSunk());\n    }\n\n    getMissedAttacks() {\n        return this.missedAttacks;\n    }\n}\n\n//# sourceURL=webpack://battleship/./src/modules/gameboard.js?");

/***/ }),

/***/ "./src/modules/player.js":
/*!*******************************!*\
  !*** ./src/modules/player.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var _gameboard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard.js */ \"./src/modules/gameboard.js\");\n\n\nclass Player {\n    constructor(name = 'Enemy') {\n        this.name = name;\n        this.gameboard = new _gameboard_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n        this.previousMoves = new Set();\n        this.hitQueue = [];\n        this.hits = [];\n        this.currentDirection = null;\n        this.directions = ['up', 'down', 'left', 'right'];\n    }\n\n    attack(opponentBoard, x, y) {\n        return opponentBoard.receiveAttack(x, y);\n    }\n\n    isValidCoord(x, y) {\n        return x >= 0 && x < 10 && y >= 0 && y < 10 && !this.previousMoves.has(`${x},${y}`);\n    }\n\n    getNextCoordInDirection([x, y], direction) {\n        switch (direction) {\n            case 'up': return [x, y - 1];\n            case 'down': return [x, y + 1];\n            case 'left': return [x - 1, y];\n            case 'right': return [x + 1, y];\n        }\n    }\n\n    getRandomMove() {\n        let x, y;\n        \n        do {\n            x = Math.floor(Math.random() * 10);\n            y = Math.floor(Math.random() * 10);\n        } while (this.previousMoves.has(`${x},${y}`));\n        \n        this.previousMoves.add(`${x},${y}`);\n        return [x, y];\n    }\n\n    queueAdjacentCoords(x, y) {\n        const adj = [\n            [x, y - 1], [x, y + 1],\n            [x - 1, y], [x + 1, y],\n        ];\n        \n        for (const [nx, ny] of adj) {\n            if (this.isValidCoord(nx, ny)) this.hitQueue.push([nx, ny]);\n        }\n    }\n\n    makeMove(opponentBoard) {\n        let x, y;\n\n        if (this.hits.length > 0 && this.currentDirection) {\n            const lastHit = this.hits[this.hits.length - 1];\n            [x, y] = this.getNextCoordInDirection(lastHit, this.currentDirection);\n            \n            if (!this.isValidCoord(x, y)) {\n                this.currentDirection = null;\n                return this.makeMove(opponentBoard);\n            }\n        } else if (this.hitQueue.length > 0) {\n            [x, y] = this.hitQueue.shift();\n        } else {\n            [x, y] = this.getRandomMove();\n        }\n\n        this.previousMoves.add(`${x},${y}`);\n        const result = opponentBoard.receiveAttack(x, y);\n\n        if (result === 'hit') {\n            this.hits.push([x, y]);\n            if (this.hits.length === 1) {\n                this.queueAdjacentCoords(x, y);\n            } else if (!this.currentDirection) {\n                const [firstX, firstY] = this.hits[0];\n                if (x === firstX) this.currentDirection = y > firstY ? 'down' : 'up';\n                else if (y === firstY) this.currentDirection = x > firstX ? 'right' : 'left';\n            }\n        }\n\n        if (result === 'miss' && this.currentDirection) {\n            this.hits.reverse();\n            this.currentDirection = this.reverseDirection(this.currentDirection);\n        }\n\n        if (result === 'sunk') {\n            this.hitQueue = [];\n            this.hits = [];\n            this.currentDirection = null;\n        }\n\n        return { result, x, y };\n    }\n\n    reverseDirection(direction) {\n        switch (direction) {\n            case 'up': return 'down';\n            case 'down': return 'up';\n            case 'left': return 'right';\n            case 'right': return 'left';\n        }\n    }\n}\n\n//# sourceURL=webpack://battleship/./src/modules/player.js?");

/***/ }),

/***/ "./src/modules/ship.js":
/*!*****************************!*\
  !*** ./src/modules/ship.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Ship)\n/* harmony export */ });\nclass Ship {\n    constructor(length) {\n        this.length = length;\n        this.hits = 0;\n    }\n  \n    hit() {\n        if (!this.isSunk()) {\n            this.hits++;\n        }\n    }\n  \n    isSunk() {\n        return this.hits >= this.length;\n    }\n}\n\n//# sourceURL=webpack://battleship/./src/modules/ship.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;