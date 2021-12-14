const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/4.txt')).toString();
const lines = input.replace(/\r/g, '').split('\n').map(s => s.trim()).filter(Boolean);

Array.prototype.sum = function() {
    return this.reduce((sum, num) => sum + num, 0);
}
const numbers = lines.shift().split(',').map((s) => parseInt(s.trim()));

const boards = [];
const createBoard = (strLines) => {
    const lines = strLines.map((str) => str.split(' ').filter(Boolean).map((n) => parseInt(n)));
    for (let i =  0; i < 5; i++) {
        lines.push([lines[0][i], lines[1][i], lines[2][i], lines[3][i], lines[4][i]]);
    }
    return lines;
}

let boardLines = []
for (const line of lines) {
    boardLines.push(line);
    if (boardLines.length === 5) {
        boards.push(createBoard(boardLines));
        boardLines = [];
    }
}

let markedNumbers = [];
const hasBoardWon = (board) => {
    return board.some((line) => line.every((number) => markedNumbers.includes(number)));
}
const getBoardScore = (board, calledNumber) => {
    const unmarkedNumbers = [...new Set(board.flat())].filter((n) => !markedNumbers.includes(n));
    const unmarkedSum = unmarkedNumbers.sum();
    return unmarkedSum * calledNumber;
}

// part 1
const getWinner = () => {
    for(let number of numbers) {
        markedNumbers.push(number);
        const winningBoard = boards.find((board) => hasBoardWon(board));
        if (winningBoard) {
            const score = getBoardScore(winningBoard, number);
            return { board: winningBoard, score };
        }
    }
    return null;
};
const winner = getWinner();
console.log('Part 1', winner ? `Winning score: ${winner.score}` : 'No winner found');

// part 2
const getLoser = () => {
    const scoreBoards = [];
    markedNumbers = [];
    numbers.forEach((number, ni) => {
        markedNumbers.push(number);
        const winningBoards = boards.filter((board) => hasBoardWon(board));
        for (const winningBoard of winningBoards) {
            if (scoreBoards.some((entry) => entry.board === winningBoard)) continue;

            const score = getBoardScore(winningBoard, number);
            scoreBoards.push({ board: winningBoard, score, round: ni, markedNumbers: markedNumbers.slice().sort((n1, n2) => n1 - n2), number });
        }
    })
    const sorted = scoreBoards.slice().sort((b1, b2) => b2.round - b1.round);
    return sorted[0];
}
const loser = getLoser();
console.log(loser);
console.log('Part 2', loser ? `Losing score: ${loser.score}` : 'No loser found');
