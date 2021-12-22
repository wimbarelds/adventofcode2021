const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/20.txt')).toString().replace(/\r/g, '');


const enhance = (map, imageLines, background) => {
  const output = [];
  for (let y = -1; y < (imageLines.length + 1); y++) {
    const outputLine = [];
    output.push(outputLine);
    for (let x = -1; x < (imageLines[0].length + 1); x++) {
      const pixelBits = [];
      for (let y2 = -1; y2 <= 1; y2++) {
        for (let x2 = -1; x2 <= 1; x2++) {
          const pixel = imageLines[y + y2]?.[x + x2] || background;
          pixelBits.push(pixel === '#' ? 1 : 0);
        }
      }
      const pixelNumber = parseInt(pixelBits.join(''), 2);
      outputLine.push(map[pixelNumber]);
    }
  }
  return output.map((line) => line.join(''));
}

const executeSteps = (numSteps) => {
  const lines = input.split('\n').filter(Boolean);
  const pixelMap = lines[0];
  let imageLines = lines.slice(1);
  const background = pixelMap[0] === '#' ? '.#' : '..';
  for (let i = 0; i < numSteps; i++) {
    const iterationBackground = background[i % 2];
    imageLines = enhance(pixelMap, imageLines, iterationBackground);
  }
  return imageLines;
}
{
  const afterSteps = executeSteps(2);
  console.log('Part 1', afterSteps.join('').replace(/\./g, '').length);
}

{
  const afterSteps = executeSteps(50);
  console.log('Part 2', afterSteps.join('').replace(/\./g, '').length);
}
