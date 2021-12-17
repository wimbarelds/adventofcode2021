const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/17.txt')).toString().replace(/\r/g, '');
const [minX, maxX] = input.substring(input.indexOf('x=') + 2, input.indexOf(',')).split('..').map(str => parseInt(str));
const [minY, maxY] = input.substring(input.indexOf('y=') + 2).split('..').map(str => parseInt(str));
const maxVelY = Math.abs(minY) - 1;
const minVelY = minY;
console.log('Part 1', (maxVelY * (maxVelY + 1)) / 2);

const validVelocities = [];

for (let x = 1; x <= Math.abs(maxX); x++) {
  const totalDistance = (x * (x + 1)) / 2;
  if (totalDistance < minX) continue;

  // we now have a technically plausible velocity for x
  for (let y = minVelY; y <= maxVelY; y++) {
    let velX = x;
    let velY = y;
    let posX = 0;
    let posY = 0;
    // we now also have a technically plausible velocity for y
    // now iterate through steps to determine if this set of velocities touches our target square
    for (;;) {
      if (posX >= minX && posX <= maxX && posY >= minY && posY <= maxY) {
        validVelocities.push({ x, y });
        break;
      }
      if (posY < minY || posX > maxX) break;
      posX += velX;
      posY += velY;
      velX = Math.max(0, velX - 1);
      velY--;
    }
  }
}

console.log(validVelocities.length);