const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/14.txt')).toString().replace(/\r/g, '');
Array.prototype.sum = function(zero = 0) {
  return this.reduce((sum, num) => sum + num, zero);
}
String.prototype.replaceAll = function(from, to) {
  let str = this;
  while(str.indexOf(from) !== -1) {
    str = str.replace(from, to);
  }
  return str;
}

{
  console.log('Part 1');
  let [ template, ...rules ] = input.split('\n').filter(Boolean);
  rules = rules.map(str => { const [pair, insert] = str.split(' -> '); return { pair, insert }; });

  const executeStep = (template, rules) => {
    for (const rule of rules) {
      const to = rule.pair.split('').join(rule.insert.toLowerCase());
      template = template.replaceAll(rule.pair, to);
    }
    return template.toUpperCase();
  }

  for (let i = 0; i < 10; i++) {
    template = executeStep(template, rules);
  }
  const frequencyMap = {};
  for (const char of template) {
    if (!frequencyMap[char]) frequencyMap[char] = 0;
    frequencyMap[char]++;
  }
  const sortedValues = Object.values(frequencyMap).sort((n1, n2) => n1 - n2);
  const [ least, most ] = [ sortedValues[0], sortedValues[sortedValues.length - 1] ];
  console.log(most - least);
}

{
  console.log('Part 2');
  const before = Date.now();
  // Initialize
  let [ template, ...rules ] = input.split('\n').filter(Boolean);
  rules = rules.map(str => { const [pair, insert] = str.split(' -> '); return { pair, insert }; });
  const allChars = [...new Set(input.replace(/[^A-Z]/g, '').split(''))];
  let pairsMap = {};
  for (const c1 of allChars) {
    for (const c2 of allChars) {
      const pair = c1 + c2;
      let count = 0;
      let searchIndex = 0;
      for(;;) {
        let index = template.indexOf(pair, searchIndex);
        if (index === -1) break;
        count++;
        searchIndex = index + 1;
      }
      pairsMap[pair] = count;
    }
  }

  const frequencyMap = {};
  for (const char of template) {
    if (!frequencyMap[char]) frequencyMap[char] = 0;
    frequencyMap[char]++;
  }

  // execute steps
  const executeStep = (map, rules) => {
    const mapClone = Object.keys(map).reduce((newMap, key) => ({...newMap, [key]: 0}), {});
    for (const rule of rules) {
      // rule.pair, rule.insert
      const newPairs = [
        rule.pair[0] + rule.insert,
        rule.insert + rule.pair[1],
      ];
      mapClone[newPairs[0]] += map[rule.pair];
      mapClone[newPairs[1]] += map[rule.pair];
      // frequency count
      if (!frequencyMap[rule.insert]) frequencyMap[rule.insert] = 0;
      frequencyMap[rule.insert] += map[rule.pair];
    }
    return mapClone;
  }

  for (let i = 0; i < 40; i++) {
    pairsMap = executeStep(pairsMap, rules);
  }

  // output results
  const sortedValues = Object.values(frequencyMap).sort((n1, n2) => n1 - n2);
  const [ least, most ] = [ sortedValues[0], sortedValues[sortedValues.length - 1] ];
  console.log({ least, most, diff: most - least, elapsed: Date.now() - before });
}