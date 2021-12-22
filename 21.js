const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/21.txt')).toString().replace(/\r/g, '');

{
  console.log('Part 1');
  let positions = input.split('\n').map(line => parseInt(line.split(' ').pop()));
  let scores = new Array(positions.length).fill(0);
  let nextRoll = 1;
  let numRolls = 0;

  const roll = () => {
    numRolls++;
    const result = nextRoll++;
    if (nextRoll > 100) nextRoll = 1;
    return result;
  }

  while(scores.every(score => score < 1000)) {
    // who rolls?
    let player = Math.floor(numRolls / 3) % positions.length;
    // roll thrice
    positions[player] += (roll() + roll() + roll()) % 10;
    if (positions[player] > 10) positions[player] -= 10;
    scores[player] += positions[player];
  }

  console.log(Math.min(...scores) * numRolls)
}

{
  console.log('Part 2');
  const before = Date.now();
  const initialPositions = input.split('\n').map(line => parseInt(line.split(' ').pop()));
  let unfinishedUniverses = [
    {
      player0score: 0,
      player1score: 0,
      player0pos: initialPositions[0],
      player1pos: initialPositions[1],
      inUniverses: 1,
    }
  ]
  let numUniversesWonByPlayer = [0, 0];

  const scoreMap = [];
  for (let a = 1; a <= 3; a++) {
    for (let b = 1; b <= 3; b++) {
      for (let c = 1; c <= 3; c++) {
        const score = a + b + c;
        let scoreItem = scoreMap.find(i => i.score === score);
        if (!scoreItem) {
          scoreItem = { score, inUniverses: 0 };
          scoreMap.push(scoreItem);
        }
        scoreItem.inUniverses++;
      }
    }
  }

  let turn = 0;
  while(unfinishedUniverses.length) {
    const nextTurnUniverses = [];
    for (const universe of unfinishedUniverses) {
      for (const scoreItem of scoreMap) {
        let newPos = universe[`player${turn}pos`] + scoreItem.score;
        while (newPos > 10) newPos -= 10;
        const newScore = universe[`player${turn}score`] + newPos;
        const inUniverses = universe.inUniverses * scoreItem.inUniverses;
        if (newScore >= 21) {
          numUniversesWonByPlayer[turn] += inUniverses;
        } else {
          let nextTurnItem = nextTurnUniverses.find(nta => {
            return nta[`player${turn}score`] === newScore &&
              nta[`player${turn}pos`] === newPos &&
              nta[`player${1 - turn}score`] === universe[`player${1 - turn}score`] &&
              nta[`player${1 - turn}pos`] === universe[`player${1 - turn}pos`]
          });
          if (!nextTurnItem) {
            nextTurnItem = {
              [`player${turn}score`]: newScore,
              [`player${turn}pos`]: newPos,
              [`player${1 - turn}score`]: universe[`player${1 - turn}score`],
              [`player${1 - turn}pos`]: universe[`player${1 - turn}pos`],
              inUniverses: 0,
            };
            nextTurnUniverses.push(nextTurnItem);
          }
          nextTurnItem.inUniverses += inUniverses;
        }
      }
    }
    unfinishedUniverses = nextTurnUniverses;
    turn = 1 - turn;
  }

  console.log(numUniversesWonByPlayer);
  console.log('Elapsed', Date.now() - before);
}