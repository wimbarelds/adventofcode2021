const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/7.txt')).toString();
const values = input.split(',').map((str) => parseInt(str)).sort(((n1, n2) => n1 - n2));

const min = values[0];
const max = values[values.length - 1];

{
  const targetDistance = (positions, target, maxdistance) => {
    let totalDistance = 0;
    for (const pos of positions) {
      totalDistance += Math.abs(pos - target);
      if (totalDistance >= maxdistance) return false;
    }
    return totalDistance;
  }

  let leastDistance = Number.MAX_SAFE_INTEGER;
  let targetLocation = null;
  for (let target = min; target <= max; target++) {
    let distance = targetDistance(values, target, leastDistance);
    if (distance !== false) {
      leastDistance = distance;
      targetLocation = target;
    }
  }

  console.log('Part 1', leastDistance);
}

{
  const targetDistance = (positions, target, maxdistance) => {
    let totalDistance = 0;
    for (const pos of positions) {
      const fd = Math.abs(pos - target)
      totalDistance += (fd * (fd + 1)) / 2;
      if (totalDistance >= maxdistance) return false;
    }
    return totalDistance;
  }

  let leastDistance = Number.MAX_SAFE_INTEGER;
  let targetLocation = null;
  for (let target = min; target <= max; target++) {
    let distance = targetDistance(values, target, leastDistance);
    if (distance !== false) {
      leastDistance = distance;
      targetLocation = target;
    }
  }

  console.log('Part 2', leastDistance);
}