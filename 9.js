const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/9.txt')).toString().replace(/\r/g, '');
Array.prototype.sum = function(zero = 0) {
  return this.reduce((sum, num) => sum + num, zero);
}

const adjacentOffsets = [[-1, 0], [1,0], [0, -1], [0, 1]];

const lines = input.split('\n').filter(Boolean).map((line) => line.split('').map((str) => parseInt(str)));
let lowPoints = [];
for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[y].length; x++) {
    const height = lines[y][x];
    const adjacent = adjacentOffsets.map(o => lines[y + o[0]]?.[x + o[1]]).filter(v => typeof v === 'number');
    if (adjacent.every(a => a > height)) {
      lowPoints.push({ x, y, height });
    }
  }
}

console.log('Part 1', lowPoints.map((lp) => lp.height + 1).sum());

// Part 2
const basins = [];
for (let i = 0; i < lowPoints.length; i++) {
  const lp = lowPoints[i];
  const basin = [{...lp, searched: false}];
  basins.push(basin);
  for(;;) {
    const searchNow = basin.filter(p => !p.searched);
    if (searchNow.length === 0) break;

    for (const pos of searchNow) {
      for (const offset of adjacentOffsets) {
        const [y, x] = [pos.y + offset[0], pos.x + offset[1]];
        const adjacentHeight = lines[y]?.[x];
        if (typeof adjacentHeight !== 'number') continue; // map edge
        if (adjacentHeight === 9) continue; // basin edge
        if (basin.some((b) => b.x === x && b.y === y)) continue; // already searched/searching
        // add to basin
        basin.push({ x, y, searched: false });
      }
      pos.searched = true;
    }
  }
}
basins.sort((b1, b2) => b1.length - b2.length);
const biggest3 = basins.slice(-3);
console.log('Part 2', biggest3[0].length * biggest3[1].length * biggest3[2].length);