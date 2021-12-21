const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/19.txt')).toString().replace(/\r/g, '');
Array.prototype.sum = function(zero = 0) {
  return this.reduce((sum, num) => sum + num, zero);
}

const before = Date.now();

const scanners = input.split('--- scanner')
  .filter(Boolean)
  .map((scanner) => 
    scanner
      .split('\n')
      .slice(1)
      .filter(Boolean)
      .map((str) => {
        return {
          neighbours: [],
          coords: str.split(',')
            .map(val => parseInt(val)),
        }
      })
  );

// For each scanner, find all of the distances between beacons
for (const scanner of scanners) {
  scanner.forEach((beacon, index, beacons) => {
    for (let i = index + 1; i < beacons.length; i++) {
      const otherBeacon = beacons[i];
      const distanceXYZ = [
        Math.abs(beacon.coords[0] - otherBeacon.coords[0]),
        Math.abs(beacon.coords[1] - otherBeacon.coords[1]),
        Math.abs(beacon.coords[2] - otherBeacon.coords[2]),
      ];
      const distance = distanceXYZ.map(d => Math.pow(d, 2)).sum();
      beacon.neighbours.push({
        distance,
        beacon: otherBeacon,
      });
      otherBeacon.neighbours.push({
        distance,
        distanceXYZ,
        beacon,
      });
    }
  })
}

const overlappingScannerBeacons = [];

// For each scanner, look at the other scanners' beacons; see if we have overlapping distances
for (let scannerAIndex = 0; scannerAIndex < scanners.length; scannerAIndex++) {
  const scannerA = scanners[scannerAIndex];
  for (let scannerBIndex = scannerAIndex + 1; scannerBIndex < scanners.length; scannerBIndex++) {
    if (scannerAIndex === scannerBIndex) continue;
    const scannerB = scanners[scannerBIndex];

    // iterate through all scannerA beacons
    for (const scannerABeacon of scannerA) {
      // list of all neighbour-distances for the given beacon
      const scannerABeaconNeighbourDistances = scannerABeacon.neighbours.map(n => n.distance);
      // find a Scanner-b beacon that can find at least 11 neighbours at equal distances
      const scannerBBeacon = scannerB.find(scannerBBeacon => {
        const scannerBBeaconNeighbourDistances = scannerBBeacon.neighbours.map(n => n.distance);
        return scannerBBeaconNeighbourDistances.filter(n => scannerABeaconNeighbourDistances.includes(n)).length >= 11;
      });

      if (scannerBBeacon) {
        // Find / Create overlapObj
        let overlapObj = overlappingScannerBeacons.find((s) => s.scannerA  == scannerAIndex && s.scannerB === scannerBIndex);
        if (!overlapObj) {
          overlapObj = { scannerA: scannerAIndex, scannerB: scannerBIndex, scannerABeacons: new Set(), scannerBBeacons: new Set() };
          overlappingScannerBeacons.push(overlapObj);
        }
        // Add scanners to overlapObj
        overlapObj.scannerABeacons.add(scannerABeacon);
        overlapObj.scannerBBeacons.add(scannerBBeacon);
      }
    }
  }
}

let scannerOffsets = [];
const transform = (coords, from, to) => {
  if (typeof to !== 'number') return coords.slice();
  const offset = scannerOffsets.find((so) => so.from === from && so.to === to);
  const coordsOut = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    const targetIndex = offset.axisMap[i];
    const input = coords[i];
    const mult = offset.axisMult[i];
    const indexOffset = offset.axisOffset[i];
    coordsOut[targetIndex] = (input * mult) - (indexOffset * mult);
  }
  return coordsOut;
}
const testTransform = (coord, expected, from, to) => {
  const success = expected.join(',') === transform(coord, from, to).join(',');
  if (!success) {
    const offset = scannerOffsets.find((so) => so.from === from && so.to === to);
    console.log('input   ', coord);
    console.log('expected', expected);
    console.log('actual  ', transform(coord, from, to));
    console.log(offset);
  }
  return success;
}
for (const overlap of overlappingScannerBeacons) {
  const getBeaconAndMatch = (scannerAIndex) => {
    const scannerABeacon = [...overlap.scannerABeacons][scannerAIndex];
    const totalScannerAOverlapDistance = scannerABeacon.neighbours.filter((n) => overlap.scannerABeacons.has(n.beacon)).map((n) => n.distance.toString()).sort().join(',');
    const scannerBBeacon = [...overlap.scannerBBeacons].find(scannerBBeacon => {
      const totalScannerBOverlapDistance = scannerBBeacon.neighbours.filter((n) => overlap.scannerBBeacons.has(n.beacon)).map((n) => n.distance.toString()).sort().join(',');
      return totalScannerAOverlapDistance === totalScannerBOverlapDistance;
    });
    return [ scannerABeacon, scannerBBeacon ];
  }
  // iterate through beacons in case 2 are aligned on 1 axis
  for (let beaconIndex = 0; beaconIndex < (overlap.scannerABeacons.size - 1); beaconIndex++) {
    // Find a first overlapping beacon in 2 scanners
    const [ scannerABeacon1, scannerBBeacon1 ] = getBeaconAndMatch(beaconIndex);
    // find a second overlapping beacon in 2 scanners
    const [ scannerABeacon2, scannerBBeacon2 ] = getBeaconAndMatch(beaconIndex + 1);

    // so now we have determined that for scannerABeacon1 === scannerBBeacon1 (but from different scanners) and scannerABeacon2 === scannerBBeacon2
    // so now we can use distances between these 2 to determine flipped orientations and offsets
    const scannerAdistance = scannerABeacon1.coords.map((v, i) => scannerABeacon2.coords[i] - v);
    const scannerBdistance = scannerBBeacon1.coords.map((v, i) => scannerBBeacon2.coords[i] - v);

    if (
      (scannerAdistance.filter((v) => Math.abs(v) === Math.abs(scannerAdistance[0])).length !== 1) ||
      (scannerAdistance.filter((v) => Math.abs(v) === Math.abs(scannerAdistance[1])).length !== 1) ||
      (scannerAdistance.filter((v) => Math.abs(v) === Math.abs(scannerAdistance[2])).length !== 1) ||
      (scannerBdistance.filter((v) => Math.abs(v) === Math.abs(scannerBdistance[0])).length !== 1) ||
      (scannerBdistance.filter((v) => Math.abs(v) === Math.abs(scannerBdistance[1])).length !== 1) ||
      (scannerBdistance.filter((v) => Math.abs(v) === Math.abs(scannerBdistance[2])).length !== 1)
    ) {
      console.log(scannerAdistance, scannerBdistance);
      throw 'This messed up';
    }

    let couldNotComputeMultis = false;
    const abAxisMap = scannerAdistance.map(d1 => scannerBdistance.findIndex(d2 => Math.abs(d1) === Math.abs(d2)));
    if (abAxisMap.slice().sort().join(',') !== '0,1,2') {
      console.log(abAxisMap);
      throw 'blah';
    }
    const abAxisMult = scannerAdistance.map((d1, i) => {
      if (d1 === 0 && scannerBdistance[abAxisMap[i]] === 0) {
        console.log('couldNotComputeMultis');
        couldNotComputeMultis = true;
      }
      return d1 === scannerBdistance[abAxisMap[i]] ? 1 : -1;
    });
    const abAxisOffset = scannerABeacon1.coords.map((p1, axisIndex) => {
      const curAxisMult = abAxisMult[axisIndex];
      const curAxisScannerBBeaconPos = scannerBBeacon1.coords[abAxisMap[axisIndex]];
      return p1 - (curAxisScannerBBeaconPos * curAxisMult);
    });

    const baAxisMap = scannerBdistance.map(d1 => scannerAdistance.findIndex(d2 => Math.abs(d1) === Math.abs(d2)));
    if (baAxisMap.slice().sort().join(',') !== '0,1,2') {
      console.log(baAxisMap);
      throw 'blah';
    }
    const baAxisMult = scannerBdistance.map((d1, i) => {
      if (d1 === 0 && scannerAdistance[baAxisMap[i]] === 0) {
        console.log('couldNotComputeMultis');
        couldNotComputeMultis = true;
      }
      return d1 === scannerAdistance[baAxisMap[i]] ? 1 : -1;
    });
    const baAxisOffset = scannerBBeacon1.coords.map((p1, axisIndex) => {
      const curAxisMult = baAxisMult[axisIndex];
      const curAxisScannerABeaconPos = scannerABeacon1.coords[baAxisMap[axisIndex]];
      return p1 - (curAxisScannerABeaconPos * curAxisMult);
    });

    if (couldNotComputeMultis) continue;

    scannerOffsets.push({
      from: overlap.scannerA,
      to: overlap.scannerB,
      axisMap: abAxisMap,
      axisMult: abAxisMult,
      axisOffset: abAxisOffset,
      scannerFromSampleBeacon1: scannerABeacon1.coords,
      scannerToSampleBeacon1: scannerBBeacon1.coords,
      scannerFromSampleBeacon2: scannerABeacon2.coords,
      scannerToSampleBeacon2: scannerBBeacon2.coords,
    })
    scannerOffsets.push({
      from: overlap.scannerB,
      to: overlap.scannerA,
      axisMap: baAxisMap,
      axisMult: baAxisMult,
      axisOffset: baAxisOffset,
      scannerFromSampleBeacon1: scannerBBeacon1.coords,
      scannerToSampleBeacon1: scannerABeacon1.coords,
      scannerFromSampleBeacon2: scannerBBeacon2.coords,
      scannerToSampleBeacon2: scannerABeacon2.coords,
    });
    break;
  }

  const allScannerABeacons = [...overlap.scannerABeacons];
  for (let i = 0; i < allScannerABeacons.length; i++) {
    const [sab, sbb] = getBeaconAndMatch(i);
    testTransform(sab.coords, sbb.coords, overlap.scannerA, overlap.scannerB);
    testTransform(sbb.coords, sab.coords, overlap.scannerB, overlap.scannerA);
  }
}

const scannerIndexes = new Array(scanners.length).fill(0).map((_, i) => i);
const transformInstructionLib = [
  { index: 0, parent: null },
];

while (transformInstructionLib.length < scanners.length) {
  const transformsInLib = scannerIndexes.filter(si => transformInstructionLib.some(t => t.index === si));
  const transformsNotInLib = scannerIndexes.filter(si => transformInstructionLib.every(t => t.index !== si));
  const availableScannerOffsets = scannerOffsets.filter(so => transformsInLib.includes(so.to) && transformsNotInLib.includes(so.from));
  for (const offset of availableScannerOffsets) {
    const index = offset.from;
    const parent = transformInstructionLib.find(item => item.index === offset.to);
    if (transformInstructionLib.every(instruction => instruction.index !== index)) {
      transformInstructionLib.push({ index, parent });
    }
  }
}

const allScanners = [];
const allCoords = new Map();
for (let i = 0; i < scanners.length; i++) {
  let scannerPos = [0, 0, 0];
  let transformInstruction = transformInstructionLib.find(tl => tl.index === i);
  if (!transformInstruction) throw 'crap, this is the issue';
  while (transformInstruction) {
    scannerPos = transform(scannerPos, transformInstruction.index, transformInstruction.parent?.index);
    transformInstruction = transformInstruction.parent;
  }

  const beacons = scanners[i].map(b => b.coords);
  for (let bi = 0; bi < beacons.length; bi++) {
    let transformInstruction = transformInstructionLib.find(tl => tl.index === i);
    if (!transformInstruction) throw 'crap, this is the issue';
    while (transformInstruction) {
      beacons[bi] = transform(beacons[bi], transformInstruction.index, transformInstruction.parent?.index);
      transformInstruction = transformInstruction.parent;
    }
  }
  allScanners.push(scannerPos);
  let numOverlapInScanner = 0
  for (const beacon of beacons) {
    const key = beacon.join(',');
    if (allCoords.has(key)) {
      numOverlapInScanner++;
    } else {
      allCoords.set(key, beacon);
    }
  }
}

console.log('Part 1', allCoords.size);

let largestManhattanDistance = 0;
for (let a = 0; a < (allScanners.length - 1); a++) {
  for (let b = a + 1; b < allScanners.length; b++) {
    let manhattanDistance = allScanners[a].map((v, i) => Math.abs(v - allScanners[b][i])).sum();
    if (manhattanDistance > largestManhattanDistance) {
      largestManhattanDistance = manhattanDistance;
    }
  }
}
console.log('Part 2', largestManhattanDistance);

console.log('Runtime', Date.now() - before);