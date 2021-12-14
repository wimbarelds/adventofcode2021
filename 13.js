const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/13.txt')).toString().replace(/\r/g, '');
Array.prototype['sum'] = function(zero = 0) {
  return this.reduce((sum, num) => sum + num, zero);
}

const printMatrix = (dots) => {
  const xMax = dots.reduce((max, dot) => Math.max(max, dot.x + 1), 0);
  const yMax = dots.reduce((max, dot) => Math.max(max, dot.y + 1), 0);
  for (let y = 0; y < yMax; y++) {
    const lineArr = new Array(xMax).fill('.').map((_, x) => {
      return dots.some(dot => dot.x === x && dot.y === y) ? '#' : '.';
    });
    console.log(lineArr.join(''));
  }
}

const getDotMatrix = () => {
  const dots = [];
  const instructions = [];
  const lines = input.split('\n');
  for (const line of lines) {
    if (line.length === 0) continue;
    if (!(line.slice(0, 11) === 'fold along ')) {
      const [x, y] = line.split(',').map((str) => parseInt(str));
      dots.push({ x, y });
    } else {
      const instruction = line.slice(11).split('=');
      instructions.push({
        axis: instruction[0],
        value: parseInt(instruction[1]),
      });
    }
  }
  return { dots, instructions }
}

const deduplicateDots = (/** @type {[]} */ dots) => {
  return dots.filter((dot, index) => index === dots.findIndex((refDot) => refDot.x === dot.x && refDot.y === dot.y));
}

const executeInstruction = (/** @type {[]} */ dots, /** @type {string} */ foldAxis, /** @type {number} */ foldCoord) => {
  const newDots = dots.filter(dot => dot[foldAxis] < foldCoord);
  const foldedDots = dots.filter(dot => dot[foldAxis] > foldCoord);
  for (const foldedDot of foldedDots) {
    const unchangedAxis = foldAxis === 'x' ? 'y' : 'x';
    const newFoldedDot = {
      [unchangedAxis]: foldedDot[unchangedAxis],
      [foldAxis]: foldCoord - (foldedDot[foldAxis] - foldCoord),
    };

    newDots.push(newFoldedDot);
  }
  const deduplicated = deduplicateDots(newDots);
  return deduplicated;
}

{
  console.log('Part 1');
  const { dots, instructions } = getDotMatrix();
  const after1instruction = executeInstruction(dots, instructions[0].axis, instructions[0].value);
  console.log(after1instruction.length);
}

{
  console.log('Part 2');
  let { dots, instructions } = getDotMatrix();
  for (const instruction of instructions) {
    dots = executeInstruction(dots, instruction.axis, instruction.value);
  }
  printMatrix(dots);
}