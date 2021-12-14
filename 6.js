const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/6.txt')).toString();

Array.prototype.sum = function(zero = 0) {
  return this.reduce((sum, num) => sum + num, zero);
}

// Part 1
{
  const tick = (inputState) => {
    let outputState = '';
    let outputAppend = '';
    for (let i = 0; i < inputState.length; i = i + 2) {
      const val = parseInt(inputState[i]);
      if (val > 0) {
        outputState += "," + (val - 1);
      } else {
        outputState += "," + 6;
        outputAppend += "," + 8;
      }
    }
    return (outputState + outputAppend).slice(1);
  }

  const simulateDays = (numDays, state) => {
    for (let i = 0; i < numDays; i++) {
      // console.log(state);
      state = tick(state);
    }
    // console.log(state);
    return state;
  }

  console.log('Part 1', Math.ceil(simulateDays(80, input).length / 2));
}

// Part 2
{
  const numDays = 256;
  const initial = input.split(',').map((str) => parseInt(str));
  let numOnCountdown = [
    // Index = days until making babies
    // Value = number of fish
    BigInt(initial.filter(n => n === 0).length), // number of 0s
    BigInt(initial.filter(n => n === 1).length), // number of 1s
    BigInt(initial.filter(n => n === 2).length), // number of 2s
    BigInt(initial.filter(n => n === 3).length), // number of 3s
    BigInt(initial.filter(n => n === 4).length), // number of 4s
    BigInt(initial.filter(n => n === 5).length), // number of 5s
    BigInt(initial.filter(n => n === 6).length), // number of 6s
    BigInt(initial.filter(n => n === 7).length), // number of 7s
    BigInt(initial.filter(n => n === 8).length), // number of 8s
  ];
  
  for (let i = 0; i < numDays; i++) {
    const makingBabies = numOnCountdown.shift();
    numOnCountdown.push(makingBabies);
    numOnCountdown[6] = numOnCountdown[6] + makingBabies;
  }
  console.log('Part 2', numOnCountdown.sum(0n));
}