const fs = require('fs');
const path = require('path');

const useTestData = false;
const folder = path.join(__dirname, useTestData ? 'sampleinput' : 'input');
const inputFile = __filename.replace(__dirname, folder).replace('.js', '.txt');
const input = fs.readFileSync(inputFile).toString().replace(/\r/g, '');

const val = (arg, variables) => {
  if ('wxyz'.indexOf(arg) !== -1) {
    return variables[arg];
  } else {
    return parseInt(arg);
  }
}

const instructionHandlers = {
  inp(arg1, arg2, variables, value) { return variables[arg1] = value; },
  add(arg1, arg2, variables) { return variables[arg1] = val(arg1, variables) + val(arg2, variables); },
  mul(arg1, arg2, variables) { return variables[arg1] = val(arg1, variables) * val(arg2, variables); },
  div(arg1, arg2, variables) { return variables[arg1] = Math.floor(val(arg1, variables) / val(arg2, variables)); },
  mod(arg1, arg2, variables) { return variables[arg1] = val(arg1, variables) % val(arg2, variables); },
  eql(arg1, arg2, variables) { return variables[arg1] = val(arg1, variables) === val(arg2, variables) ? 1 : 0; },
}

const instructions = input.split('inp w')
  .filter(Boolean)
  .map(part => `inp w${part}`.split('\n')
    .filter(Boolean)
    .map(line => {
      let [ cmd, arg1, arg2 ] = line.split(' ');
      return { cmd, fn: instructionHandlers[cmd], arg1, arg2 };
    })
  );

const computeMaxModelNum = () => {
  const start = Math.pow(9, 7) - 1;
  // For part 1
  // for (let total = start; total >= 0; total--) {
  // For part 2
  for (let total = 0; total <= start; total++) {
    const variables = { w: 0, x: 0, y: 0, z: 0 };
    let baseIndex = 0;
    let modelNum = '';
    for (let index = 0; index < 14; index++) {
      let useDigit;
      const digitInstructions = instructions[index];
      // Determine if this instruction should make our Z go down
      if (val(digitInstructions[5].arg2, variables) < 0) {
        // This is one of 7 instructions with a negative addition as 6th instruction
        // meaning our z must go down here
        // for z to go down, w must equal z % 26 -  9
        useDigit = variables.z % 26 + val(digitInstructions[5].arg2, variables);
        if (useDigit < 1 || useDigit > 9) {
          if (variables.z === 0) variables.z = 1;
          break;
        }
      } else {
        // this is one of  7 instructions with a positive addition as 6th instruction
        // meaning our z can only go up here. Compute a digit based on our 'total'
        useDigit = Math.floor(total / Math.pow(9, 6 - baseIndex++)) % 9 + 1;
        if (useDigit > 9 || useDigit < 1 || baseIndex > 7) throw 'this shouldnt happen';
      }
      modelNum += useDigit;
      for (const digitInstruction of digitInstructions) {
        const { fn, arg1, arg2 } = digitInstruction;
        fn(arg1, arg2, variables, useDigit);
      }
    }
    
    if (variables.z === 0){
      return modelNum;
    }
  }
}

{  
  console.log(computeMaxModelNum());
}
