const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/18.txt')).toString().replace(/\r/g, '');
Array.prototype.sum = function(zero = 0) {
  return this.reduce((sum, num) => sum + num, zero);
}

const trySplit = (data) => {
  for (const child of data.items) {
    if (typeof child === 'object') {
      const result = trySplit(child);
      if (result) return result;
    }
    if (typeof child === 'number' && child >= 10) {
      const index = data.items.indexOf(child);
      const values = [Math.floor(child / 2), Math.ceil(child / 2)];
      const item = {
        parent: data,
        items: values,
        depth: data.depth + 1,
        toString: () => {
          return `[${item.items.map(v => v.toString()).join(',')}]`;
        },
        magnitude: () => {
          const [v0, v1] = item.items.map((v) => {
            if (typeof v === 'number') return v;
            return v.magnitude();
          });
          return v0 * 3 + v1 * 2;
        }
      };
      data.items[index] = item;
      return true;
    }
  }
  return false;
}

const explode = (explodablePair) => {
  {
    // Step 1: add the left value to the first number on the left
    let self = explodablePair;
    for(;;) {
      if (!self.parent) break;
      // First traverse up the tree so long as the explodedPair's parent is on the left of its pair
      const ownIndex = self.parent.items.indexOf(self);
      if (ownIndex === 0) {
        // self was on the left of parent
        self = self.parent;
      } else {
        // ownIndex === 1
        // self was on the right of parent
        // if the value on the left of parent is a number, add to that
        if (typeof self.parent.items[0] === 'number') {
          self.parent.items[0] += explodablePair.items[0];
          break;
        } else {
          // the value on the left was a pair, recursively find the right most value inside of it
          let addNumberTo = self.parent.items[0];
          for (;;) {
            if (typeof addNumberTo.items[1] === 'number') {
              // Found the right most number, add to it
              addNumberTo.items[1] += explodablePair.items[0];
              break;
            } else {
              // right-most number not found, traverse deeper
              addNumberTo = addNumberTo.items[1];
            }
          }
          break;
        }
      }
    }
  }
  {
    // Step 2: add the right value to the first number on the right
    let self = explodablePair;
    for(;;) {
      if (!self.parent) break;
      // First traverse up the tree so long as the explodedPair's parent is on the left of its pair
      const ownIndex = self.parent.items.indexOf(self);
      if (ownIndex === 1) {
        // self was on the left of parent
        self = self.parent;
      } else {
        // ownIndex === 0
        // self was on the right of parent
        // if the value on the left of parent is a number, add to that
        if (typeof self.parent.items[1] === 'number') {
          self.parent.items[1] += explodablePair.items[1];
          break;
        } else {
          // the value on the left was a pair, recursively find the right most value inside of it
          let addNumberTo = self.parent.items[1];
          for (;;) {
            if (typeof addNumberTo.items[0] === 'number') {
              // Found the right most number, add to it
              addNumberTo.items[0] += explodablePair.items[1];
              break;
            } else {
              // right-most number not found, traverse deeper
              addNumberTo = addNumberTo.items[0];
            }
          }
          break;
        }
      }
    }
  }
  {
    // Step 3: replace the exploded pair with a 0
    const parent = explodablePair.parent;
    if (parent.items[0] === explodablePair) parent.items[0] = 0;
    if (parent.items[1] === explodablePair) parent.items[1] = 0;
  }
}

const parse = (data, parent = null, depth = 0) => {
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }
  const object = { items: null, parent, depth };
  object.items = data.map(item => {
    if (typeof item === 'number') {
      return item;
    } else {
      return parse(item, object, depth + 1);
    }
  })
  object.toString = () => {
    const parts = object.items.map((v) => v.toString());
    return `[${parts.join(',')}]`;
  }
  object.magnitude = () => {
    const [v0, v1] = object.items.map((v) => {
      if (typeof v === 'number') return v;
      return v.magnitude();
    });
    return v0 * 3 + v1 * 2;
  }
  return object;
}

const findExplodablePair = (data) => {
  if (data.depth >= 4 && typeof data.items[0] === 'number' && typeof data.items[1] === 'number') {
    return data;
  } else {
    for (const child of data.items) {
      if (typeof child !== 'number') {
        const canChildExplode = findExplodablePair(child);
        if (canChildExplode) return canChildExplode;
      }
    }
  }
  return false;
}

const reduce  = (line) => {
  const data = parse(line);
  // console.log(data.toString());
  // See if we can explode
  for (;;) {
    const explodablePair = findExplodablePair(data);
    if (explodablePair) {
      explode(explodablePair);
    } else {
      const didSplit = trySplit(data);
      if (!didSplit) break;
    }
    // console.log(data.toString());
  }
  return data.toString();
  // if any pair of regular numbers is nested inside 4 pairs, the leftmost pair explodes
  // if any regular number is 10 or greater, the leftmost such regular number splits
  // one action per step
}

const magnitude = (v) => {

}

{
  const lines = input.split('\n');
  let sum = reduce(lines.shift());
  for (const line of lines) {
    const reducedLine = reduce(line);
    sum = reduce(`[${sum},${reducedLine}]`);
  }
  // console.log(sum);
  console.log('Part 1', parse(sum).magnitude());
}

{
  let largestMagnitude = 0;
  const lines = input.split('\n');
  for (let a = 0; a < lines.length; a++) {
    for (let b = 0; b < lines.length; b++) {
      if (a === b) continue;
      const lineA = reduce(lines[a]);
      const lineB = reduce(lines[b]);
      const sum = parse(reduce(`[${lineA},${lineB}]`)).magnitude();
      if (sum > largestMagnitude) largestMagnitude = sum;
    }
  }
  console.log('Part 2',  largestMagnitude);
}