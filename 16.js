const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input/16.txt')).toString().replace(/\r/g, '');
const inputBinary = input.split('').map((str) => parseInt(str, 16).toString(2).padStart(4, '0')).join('');
Array.prototype.sum = function(zero = 0) {
  return this.reduce((sum, num) => sum + num, zero);
}
Array.prototype.product = function() {
  return this.reduce((sum, num) => sum * num, 1);
}

let fullStringIndex = 0;
let versionSum = 0;

const readPackets = (/** @type {number} */ numPackets, /** @type {number} */ totalLength) => {
  const startIndex = fullStringIndex;
  const packets = [];
  for (;;) {
    // if iether condition is true, we're done
    if (numPackets && packets.length === numPackets) break;
    if (totalLength && fullStringIndex >= (startIndex + totalLength)) break;
    const version = parseInt(inputBinary.substr(fullStringIndex, 3), 2);
    const typeId = parseInt(inputBinary.substr(fullStringIndex + 3, 3), 2);
    fullStringIndex += 6;
    if (typeId === 4) {
      let packetValueBits = '';
      for (;;) {
        const leadingBit = inputBinary.substr(fullStringIndex, 1);
        packetValueBits += inputBinary.substr(fullStringIndex + 1, 4);
        fullStringIndex += 5;
        if (leadingBit === '0') break;
      }
      const value = parseInt(packetValueBits, 2);
      packets.push({ version, typeId, value });
    } else {
      const lengthTypeId = inputBinary.substr(fullStringIndex, 1);
      fullStringIndex++;

      if (lengthTypeId === '0') {
        const subPacketsBitLength = parseInt(inputBinary.substr(fullStringIndex, 15), 2);
        fullStringIndex += 15;
        packets.push({
          version,
          typeId,
          subpackets: readPackets(0, subPacketsBitLength),
        });
      } else if (lengthTypeId === '1') {
        const numSubpackets = parseInt(inputBinary.substr(fullStringIndex, 11), 2);
        fullStringIndex += 11;
        packets.push({
          version,
          typeId,
          subpackets: readPackets(numSubpackets, 0),
        });        
      }
    }

    // Sum versions
    versionSum += version;
  }
  return packets;
};

const outsidePacket = readPackets(1)[0];
console.log('Part 1', versionSum);

// typeId 0 === sum
// typeId 1 === product (multiply all values)
// typeId 2 === Math.min
// typeId 3 === Math.max
// typeId 5 === (subpacket1 > subpacket2) ? 1 : 0
// typeId 6 === (subpacket1 < subpacket2) ? 1 : 0
// typeId 7 === (subpacket1 === subpacket2) ? 1 : 0

const getPacketValue = (packet) => {
  if (packet.typeId === 4) {
    return packet.value;
  }

  const subpacketValues = packet.subpackets.map((subpacket) => getPacketValue(subpacket));
  if (packet.typeId === 0) {
    return subpacketValues.sum();
  } else if (packet.typeId === 1) {
    return subpacketValues.product();
  } else if (packet.typeId === 2) {
    return Math.min(...subpacketValues);
  } else if (packet.typeId === 3) {
    return Math.max(...subpacketValues);
  } else if (packet.typeId === 5) {
    const [p1, p2] = subpacketValues;
    return p1 > p2 ? 1 : 0;
  } else if (packet.typeId === 6) {
    const [p1, p2] = subpacketValues;
    return p1 < p2 ? 1 : 0;
  } else if (packet.typeId === 7) {
    const [p1, p2] = subpacketValues;
    return p1 === p2 ? 1 : 0;
  }
}

console.log('Part 2', getPacketValue(outsidePacket));