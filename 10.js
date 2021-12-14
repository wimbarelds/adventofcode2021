const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/10.txt')).toString().replace(/\r/g, '');

const syntax = [
  { open: '(', close: ')' },
  { open: '[', close: ']' },
  { open: '{', close: '}' },
  { open: '<', close: '>' },
];
const isOpener = (char) => syntax.some((tag) => tag.open === char);
const getCloseFor = (opener) => syntax.find((tag) => tag.open === opener).close;
const isCloserFor = (closer, opener) => getCloseFor(opener) === closer;
Array.prototype.last = function(){ return this[this.length - 1]};
const lines = input.split('\n');

{
  console.log('Part 1');
  const scoreMap = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  }  
  let score = 0;
  for(const line of lines) {
    let nesting = [];
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (isOpener(char)) {
        nesting.push(char);
      } else {
        if (isCloserFor(char, nesting.last())) {
          nesting = nesting.slice(0, nesting.length - 1);
        } else {
          score += scoreMap[char];
          break;
        }
      }
    }
  }
  console.log({ score });
}

{
  console.log('Part 2');
  const scoreMap = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  };
  let scores = [];
  for(const line of lines) {
    let nesting = [];
    let invalid = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (isOpener(char)) {
        nesting.push(char);
      } else {
        if (isCloserFor(char, nesting.last())) {
          nesting = nesting.slice(0, nesting.length - 1);
        } else {
          invalid = true;
          break;
        }
      }
    }
    if (!invalid && nesting.length > 0) {
      // incomplete
      nesting.reverse();
      let score = 0;
      for (const opener of nesting) {
        score *= 5;
        const closer = getCloseFor(opener);
        const closerScore = scoreMap[closer];
        score += closerScore;
      }
      scores.push(score);
    }
  }
  scores.sort((s1, s2) => s1 - s2);
  console.log(scores[(scores.length - 1) / 2]);
}