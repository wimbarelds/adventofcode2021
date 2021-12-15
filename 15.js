const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'sampleinput/15.txt')).toString().replace(/\r/g, '');

const findLowestRisk = (data) => {
  const exists = (y, x) => data[y]?.[x] !== undefined;
  const adjacentOffsets = [
    { y: -1, x: 0 },
    { y: 0, x: -1 },
    { y: 1, x: 0 },
    { y: 0, x: 1 },
  ];
  const optimizePrior = (y, x) => {
    const origin = data[y][x];
    const updated = [];
    adjacentOffsets
      .map((o) => ({ x: x + o.x, y: y + o.y }))
      .filter((pos) => exists(pos.y, pos.x))
      .filter((pos) => data[pos.y][pos.x].optimal !== null)
      .forEach((pos) => {
        const datapoint = data[pos.y][pos.x];
        if (datapoint.optimal > (datapoint.risk + origin.optimal)) {
          datapoint.optimal = datapoint.risk + origin.optimal;
          updated.push(pos);
        }
      });
    for (const pos of updated) {
      optimizePrior(pos.y, pos.x);
    }
  }

  for (let i = 0; i < data.length + data[0].length; i++) {
    for (let j = 0; j <= i; j++) {
      const y = i - j;
      const x = j;
      if (!exists(y, x)) continue;
      if (x === 0 && y === 0) {
        data[y][x].optimal = 0;
      } else {
        data[y][x].optimal = Number.MAX_SAFE_INTEGER;
        if (exists(y - 1, x)) {
          const pathValue = data[y - 1][x].optimal + data[y][x].risk;
          if (pathValue < data[y][x].optimal) {
            data[y][x].optimal = pathValue;
          }
        }
        if (exists(y, x - 1)) {
          const pathValue = data[y][x - 1].optimal + data[y][x].risk;
          if (pathValue < data[y][x].optimal) {
            data[y][x].optimal = pathValue;
          }
        }
        optimizePrior(y, x);
      }
    }
  }
  return data.slice().pop().slice().pop().optimal;
}


{
  console.log('Part 1');
  const data = input
    .split('\n')
    .map((line) => 
      line.split('')
      .map((c) => ({ risk: parseInt(c), optimal: null }))
    );
  console.log(findLowestRisk(data));
}

{
  console.log('Part 2');
  const inputLines = input.split('\n');
  const data = [];
  for (let repeatY = 0; repeatY < 5; repeatY++) {
    for (const line of inputLines) {
      const row = [];
      data.push(row);
      for (let repeatX = 0; repeatX < 5; repeatX++) {
        for (let x = 0; x < line.length; x++) {
          let value = parseInt(line[x]) + repeatX + repeatY;
          while (value > 9) {
            value = value - 9;
          }
          row.push({
            risk: value,
            optimal: null,
          });
        }
      }
    }
  }
  console.log(findLowestRisk(data));
}
