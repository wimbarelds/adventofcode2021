const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/12.txt')).toString().replace(/\r/g, '');
Array.prototype['sum'] = function(zero = 0) {
  return this.reduce((sum, num) => sum + num, zero);
}

const parseInput = (str) => {
  const locations = [];
  const lines = str.split('\n').map((line) => line.split('-'));
  for (const line of lines) {
    for (const loc of line) {
      if (!locations.some((location) => location.name === loc)) {
        locations.push({
          name: loc,
          small: loc === loc.toLowerCase(),
          connections: [],
        });
      }
    }
  }
  for (const line of lines) {
    const [loc1, loc2] = line.map((loc) => locations.find((location) => location.name === loc));
    loc1.connections.push(loc2);
    loc2.connections.push(loc1);
  }
  for (let location of locations) {
    location.connections = location.connections.filter((con) => con.name !== 'start');
    if (location.name === 'end') {
      location.connections = [];
    }
  }
  return locations;
}

{
  console.log('Part 1');
  const before = Date.now();
  const locations = parseInput(input);
  const start = locations.find((loc) => loc.name === 'start');
  let paths = [{history: [start], done: false, dead: null}];
  while(paths.some(path => !path.done)) {
    const iterationPaths = paths.slice();
    for (const path of iterationPaths) {
      if (path.done) continue;
      const curPos = path.history[path.history.length - 1];
      if (curPos.name === 'end') {
        path.done = true;
        path.dead = false;
        continue;
      }
      const possibleTargets = curPos.connections.filter((connection) => {
        return !connection.small || !path.history.includes(connection);
      });
      if (possibleTargets.length === 0) {
        path.done = true;
        path.dead = true;
      } else {
        const newPaths = possibleTargets.map(target => {
          const history = [...path.history, target];
          return { history, done: false, dead: null };
        });
        paths.splice(paths.indexOf(path), 1, ...newPaths);
      }
    }
  }
  const resultPaths = paths.filter(path => !path.dead).map((path) => path.history.map(loc => loc.name).join(','));
  console.log(resultPaths.length);
  console.log('Elapsed', Date.now() - before)
}

{
  const before = Date.now();
  console.log('Part 2');
  const locations = parseInput(input);
  const start = locations.find((loc) => loc.name === 'start');
  let paths = [{history: [start], done: false, dead: null}];
  while(true) {
    let foundNewPaths = false;
    const iterationPaths = paths.slice();
    for (const path of iterationPaths) {
      if (path.done) continue;
      const hasRevisitedSmallTwice = path.history.filter(item => item.small).length !== new Set(path.history.filter(item => item.small)).size;
      const curPos = path.history[path.history.length - 1];
      if (curPos.name === 'end') {
        path.done = true;
        path.dead = false;
        continue;
      }

      const possibleTargets = curPos.connections.filter((connection) => {
        return !hasRevisitedSmallTwice || !connection.small || !path.history.includes(connection);
      });
      if (possibleTargets.length === 0) {
        path.done = true;
        path.dead = true;
      } else {
        foundNewPaths = true;
        const newPaths = possibleTargets.map(target => {
          const history = [...path.history, target];
          return { history, done: false, dead: null };
        });
        paths.splice(paths.indexOf(path), 1, ...newPaths);
      }
    }
    if (!foundNewPaths) break;
  }
  const resultPaths = paths.filter(path => !path.dead);
  console.log(paths.length);
  console.log(resultPaths.length);
  console.log('elapsed', Date.now() - before)
}
