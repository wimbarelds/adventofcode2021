const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/11.txt')).toString().replace(/\r/g, '');
Array.prototype.sum = function(zero = 0) {
  return this.reduce((sum, num) => sum + num, zero);
}
{
  console.log('Part 1');
  const numSteps = 100;
  let numFlashes = 0;
  const flashOffsets = [{ y: -1, x: -1}, { y: -1, x: 0}, { y: -1, x: 1}, { y: 0, x: -1}, { y: 0, x: 1}, { y: 1, x: -1}, { y: 1, x: 0}, { y: 1, x: 1}];
  const flash = (grid) => {
    while(true) {
      let didFlash = false;
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
          if (grid[y][x] > 9) {
            didFlash = true;
            numFlashes++;
            grid[y][x] = 0;
            for (const offset of flashOffsets) {
              const pos = { y: y + offset.y, x: x + offset.x};
              const curValue = grid[pos.y]?.[pos.x];
              if (typeof curValue === 'number' && curValue > 0) {
                grid[pos.y][pos.x]++;
              }
            }
          }
        }
      }
      if (!didFlash) break;
    }
  };
  const lines = input.split('\n').map((line) => line.split(''));
  for (let i = 0; i < numSteps; i++) {
    for (let y = 0; y < lines.length; y++) {
      const line = lines[y];
      for (let x = 0; x < line.length; x++) {
        // increment by 1
        line[x]++;
      }
    }
    flash(lines);
  }
  console.log({ numFlashes });
}

{
  console.log('Part 2');
  let flashesInStep = 0;
  const flashOffsets = [{ y: -1, x: -1}, { y: -1, x: 0}, { y: -1, x: 1}, { y: 0, x: -1}, { y: 0, x: 1}, { y: 1, x: -1}, { y: 1, x: 0}, { y: 1, x: 1}];
  const flash = (grid) => {
    while(true) {
      let didFlash = false;
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
          if (grid[y][x] > 9) {
            didFlash = true;
            flashesInStep++;
            grid[y][x] = 0;
            for (const offset of flashOffsets) {
              const pos = { y: y + offset.y, x: x + offset.x};
              const curValue = grid[pos.y]?.[pos.x];
              if (typeof curValue === 'number' && curValue > 0) {
                grid[pos.y][pos.x]++;
              }
            }
          }
        }
      }
      if (!didFlash) break;
    }
  };
  const lines = input.split('\n').map((line) => line.split(''));
  let step = 1;
  const maxFlashesInStep = lines.map(line => line.length).sum();
  for (;; step++) {
    flashesInStep = 0;
    for (let y = 0; y < lines.length; y++) {
      const line = lines[y];
      for (let x = 0; x < line.length; x++) {
        // increment by 1
        line[x]++;
      }
    }
    flash(lines);
    if (flashesInStep === maxFlashesInStep) {
      console.log({ step, flashesInStep });
      break;
    }
  }
}