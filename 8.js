const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/8.txt')).toString().replace(/\r/g, '');
const nummap = [
  /* 0 */ 'abcefg',   // 6
  /* 1 */ 'cf',       // 2
  /* 2 */ 'acdeg',    // 5
  /* 3 */ 'acdfg',    // 5
  /* 4 */ 'bcdf',     // 4
  /* 5 */ 'abdfg',    // 5
  /* 6 */ 'abdefg',   // 6
  /* 7 */ 'acf',      // 3
  /* 8 */ 'abcdefg',  // 7
  /* 9 */ 'abcdfg',   // 6
];
Array.prototype.sum = function(zero = 0) {
  return this.reduce((sum, num) => sum + num, zero);
}

const before = Date.now();

const lines = input.split('\n').map(line => line.split(' | ').map(part => part.split(' ')));
// part 1
const num1478 = lines.map((line) => line[1]).flat().filter(chunk => [2,4,3,7].includes(chunk.length)).length;
console.log('Part 1', num1478);

// part 2
const output = lines.map(line => {
  const wiremap = {
    a: 'abcdefg'.split(''),
    b: 'abcdefg'.split(''),
    c: 'abcdefg'.split(''),
    d: 'abcdefg'.split(''),
    e: 'abcdefg'.split(''),
    f: 'abcdefg'.split(''),
    g: 'abcdefg'.split(''),
  }
  const mapValues = () => Object.values(wiremap);
  
  const lineParts = line.flat();
  for(let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
    const chunk = lineParts[i % lineParts.length];
    let possibleNumbers = [0,1,2,3,4,5,6,7,8,9]
      // Naive filter based on length
      .filter(number => chunk.length === nummap[number].length)
      // Filter based on segments
      .filter(number => {
        const expectedSegments = nummap[number];
        for (const segment of chunk) {
          if (!wiremap[segment].some(segmentOption => expectedSegments.includes(segmentOption))) {
            return false;
          }
        }
        return true;
      });
    
    // determine which segments any of the characters in our chunk could be
    const possibleSegments = [...new Set(possibleNumbers.map((pNumber) => nummap[pNumber].split('')).flat())];
  
    // update chunk-chars in wiremap based on remaining possible segments
    for (const char of chunk) {
      /** @type {string[]} */
      const wireto = wiremap[char];
      const newwireto = wireto.filter(curMapOption => possibleSegments.includes(curMapOption));
      if (wireto.length !== newwireto.length) {
        wiremap[char] = newwireto;
      }
    }
  
    // if there's any equal 2 length-segments, remove those segments everywhere else
    const wiremapkeys = Object.keys(wiremap);
    const keyswith2options = wiremapkeys.filter((key) => wiremap[key].length === 2);
    for (const keyswith2option of keyswith2options) {
      const keyOptions = wiremap[keyswith2option].join('');
      const keysWithSameOptions = keyswith2options.filter((key) => wiremap[key].join('') === keyOptions);
      if (keysWithSameOptions.length < 2) continue;
      if (keysWithSameOptions.length === 2) {
        // Remove these options everywhere else
        for (const option of keyOptions) {
          for (const wiremapkey of wiremapkeys) {
            if  (keysWithSameOptions.includes(wiremapkey)) continue;
            wiremap[wiremapkey] = wiremap[wiremapkey].filter((wiremapentryOption) => wiremapentryOption !== option);
          }
        }
      }
      if (keysWithSameOptions.length > 2) {
        throw new 'You fucked up';
      }
    }
  
    // if theres any wiremap entries with only 1 option, remove that option everywhere else
    const keyswith1option = wiremapkeys.filter((key) => wiremap[key].length === 1);
    for (const key of keyswith1option) {
      const keyOptions = wiremap[key];
      for (const option of keyOptions) {
        for (const wiremapkey of wiremapkeys) {
          if  (wiremapkey === key) continue;
          wiremap[wiremapkey] = wiremap[wiremapkey].filter((wiremapentryOption) => wiremapentryOption !== option);
        }
      }
    }
  
    // determine if we 'know' this chunk is a 6
    if (chunk.length === 6) {
      // its a 0, 6, or 9
      // determine if we're "ready" (ie: having 2 mapValues that are 'cf')
      if (mapValues().map(v => v.join('')).filter(v => v === 'cf').length === 2) {
        const chunkChars = chunk.split('');
        const charsMappingToCF = chunkChars.filter(char => wiremap[char].join('') === 'cf');
        if (charsMappingToCF.length === 1) {
          // this means its a 6, which means the char mapping to [c,f] is actually f
          const charMappingToF = charsMappingToCF[0];
          wiremap[charMappingToF] = ['f'];
          // and the other 'cf' character is c
          const keyOfC = wiremapkeys.find(wmk => wiremap[wmk].join('') === 'cf');
          wiremap[keyOfC] = ['c'];
        }
      }
    }
  
    // turn possible numbers into possible segments
    if (i > 500) break;
  
    if (mapValues().every(options => options.length === 1)) break;
  }
  if (!mapValues().every(options => options.length === 1)) throw 'Shit';

  const outputChunksEncoded = line[1];
  let outputValue = '';
  for (const encodedChunk of outputChunksEncoded) {
    const decodedChunk = [...encodedChunk].map(encodedChar => wiremap[encodedChar][0]).sort().join('');
    const decodedValue = nummap.findIndex(expectedChunk => [...expectedChunk].sort().join('') === decodedChunk);
    outputValue += decodedValue;
  }
  return parseInt(outputValue);
});
console.log('Part 2', output.sum());

const elapsed = Date.now() - before;
console.log({ elapsed })