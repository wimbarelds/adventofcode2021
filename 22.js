const fs = require('fs');
const path = require('path');

const useTestData = false;
const folder = path.join(__dirname, useTestData ? 'sampleinput' : 'input');
const inputFile = __filename.replace(__dirname, folder).replace('.js', '.txt');
const input = fs.readFileSync(inputFile).toString().replace(/\r/g, '');

const lines = input.split('\n');
const instructions = lines.map(line => {
  const [state, coords] = line.split(' ');
  const [x, y, z] = coords.split(',').map(range => {
    const [ from, to ] = range.slice(2).split('..').map(strVal => parseInt(strVal));
    return { from, to };
  });
  return {
    state: state === 'on',
    x1: x.from,
    x2: x.to,
    y1: y.from,
    y2: y.to,
    z1: z.from,
    z2: z.to,
  };
});

{
  console.log('Part 1');
  const litBlocks = new Set();
  for (const instruction of instructions) {
    for (let x = Math.max(-50, instruction.x1); x <= Math.min(50, instruction.x2); x++) {
      for (let y = Math.max(-50, instruction.y1); y <= Math.min(50, instruction.y2); y++) {
        for (let z = Math.max(-50, instruction.z1); z <= Math.min(50, instruction.z2); z++) {
          const key = `${x},${y},${z}`;
          if (instruction.state) {
            litBlocks.add(key);
          } else {
            litBlocks.delete(key);
          }
        }
      }
    }
  }
  console.log(litBlocks.size);
}

{
  console.log('Part 2');
  const before = Date.now();
  let litBlocks = [];
  const isOverlapping = (instruction1, instruction2) => {
    if (instruction1.x2 < instruction2.x1) return false;
    if (instruction1.y2 < instruction2.y1) return false;
    if (instruction1.z2 < instruction2.z1) return false;
    if (instruction1.x1 > instruction2.x2) return false;
    if (instruction1.y1 > instruction2.y2) return false;
    if (instruction1.z1 > instruction2.z2) return false;
    return true;
  }

  const clone = (instruction) => ({ ... instruction });

  const splitSidesFromWorkCube = (workCube, overlapCube, axis) => {
    const sides = [];
    workCube = { ...workCube }; // make a copy of the workCube to avoid mutating our input
    if (overlapCube[`${axis}1`] > workCube[`${axis}1`]) {
      // create an additional sideCube for the left/top/front most part of our current 'workCube'
      // this is the part of the workCube that is fully to the left/above/in front of the overlapping cube
      const sideCube = {
        ...workCube,
        [`${axis}2`]: overlapCube[`${axis}1`] - 1,
      };
      // Move the left/top/front most point of our work cube to the nearest x/y/z position of the overlay
      workCube[`${axis}1`] = overlapCube[`${axis}1`];
      sides.push(sideCube);
    }
    if (overlapCube[`${axis}2`] < workCube[`${axis}2`]) {
      // create an additional sideCube for the right/bottom/rear most part of our current 'workCube'
      // this is the part of the workCube that is fully to the right/below/behind the overlapping cube
      const sideCube = {
        ...workCube,
        [`${axis}1`]: overlapCube[`${axis}2`] + 1,
      };
      // Move the right/bottom/rear most point of our work cube to the nearest x/y/z position of the overlay
      workCube[`${axis}2`] = overlapCube[`${axis}2`];
      sides.push(sideCube);
    }
    // everything left in the middle (null if nothing)
    const middleCube = (
      (workCube[`${axis}1`] <= workCube[`${axis}2`])
      ? workCube
      : null
    );
    return { sides, middleCube };
  }

  let i = 0;
  for (const instruction of instructions) {
    let overlapCubes = litBlocks.filter(lb => isOverlapping(lb, instruction));
    if (instruction.state) {
      // Turn on
      let newCubes = [clone(instruction)];
      for (const overlapCube of overlapCubes) {
        newCubes = newCubes.map(newCube => {
          // If this newCube doesn't overlap with the overlapCube
          // then don't shave off any sides
          if (!isOverlapping(newCube, overlapCube)) return [newCube];

          // horizontal
          const splitCubes = [];
          const xSplit = splitSidesFromWorkCube(newCube, overlapCube, 'x');
          splitCubes.push(...xSplit.sides);

          if (xSplit.middleCube) {
            const ySplit = splitSidesFromWorkCube(xSplit.middleCube, overlapCube, 'y');
            splitCubes.push(...ySplit.sides);

            if (ySplit.middleCube) {
              const zSplit = splitSidesFromWorkCube(ySplit.middleCube, overlapCube, 'z');
              splitCubes.push(...zSplit.sides);
            }
          }
          return splitCubes;
        }).flat();
      }
      litBlocks.push(...newCubes);
    } else {
      // Turn off
      // remove all of the cubes that overlap with this instruction
      litBlocks = litBlocks.filter(lb => !overlapCubes.includes(lb));
      for (const cube of overlapCubes) {
        // we need to keep the parts of this cube that DO NOT
        // overlap with instruction
        const xSplit = splitSidesFromWorkCube(cube, instruction, 'x');
        litBlocks.push(...xSplit.sides);

        if (xSplit.middleCube) {
          const ySplit = splitSidesFromWorkCube(xSplit.middleCube, instruction, 'y');
          litBlocks.push(...ySplit.sides);

          if (ySplit.middleCube) {
            const zSplit = splitSidesFromWorkCube(ySplit.middleCube, instruction, 'z');
            litBlocks.push(...zSplit.sides);
          }
        }
      }
    }
  }

  let numLitBlocks = 0;
  for (const litBlock of litBlocks) {
    const sizeX = (litBlock.x2 - litBlock.x1) + 1;
    const sizeY = (litBlock.y2 - litBlock.y1) + 1;
    const sizeZ = (litBlock.z2 - litBlock.z1) + 1;
    numLitBlocks += (sizeX * sizeY * sizeZ);
  }
  console.log(numLitBlocks);
  console.log('Elapsed', Date.now() - before);
}
