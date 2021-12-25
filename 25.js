const fs = require('fs');
const path = require('path');

const useTestData = false;
const folder = path.join(__dirname, useTestData ? 'sampleinput' : 'input');
const inputFile = __filename.replace(__dirname, folder).replace('.js', '.txt');
const input = fs.readFileSync(inputFile).toString().replace(/\r/g, '');


const moveCucumbers = (grid, type, moveY, moveX) => {
  const moves = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== type) continue;
      const targetY = (y + moveY) % grid.length;
      const targetX = (x + moveX) % grid[y].length;
      if (grid[targetY][targetX] === '.') {
        moves.push({
          from: { x, y },
          to: { x: targetX, y: targetY },
        });
      }
    }
  }
  for (const move of moves) {
    grid[move.from.y][move.from.x] = '.';
    grid[move.to.y][move.to.x] = type;
  }
  return moves.length;
}

{
  const grid = input.split('\n').map(line => line.split(''));
  for (let step = 1;; step++) {
    let numMoved = 0;
    numMoved += moveCucumbers(grid, '>', 0, 1);
    numMoved += moveCucumbers(grid, 'v', 1, 0);
    if (!numMoved) {
      console.log(`Stopped moving after ${step} steps`);
      break;
    }
  }
}