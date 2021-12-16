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

const readBits = (/** @type {number} */ numBits, /** @type {boolean} */ asBinary = false) => {
  const bits = inputBinary.substr(fullStringIndex, numBits);
  fullStringIndex += numBits;
  return asBinary ? bits : parseInt(bits, 2);
}

const readPackets = (/** @type {number} */ numPackets, /** @type {number} */ totalLength) => {
  const startIndex = fullStringIndex;
  const packets = [];
  for (;;) {
    // if either condition is true, we're done
    if (numPackets && packets.length === numPackets) break;
    if (totalLength && fullStringIndex >= (startIndex + totalLength)) break;
    const version = readBits(3);
    const typeId = readBits(3);
    if (typeId === 4) {
      let packetValueBits = '';
      for (;;) {
        const leadingBit = readBits(1);
        packetValueBits += readBits(4, true);
        if (leadingBit === 0) break;
      }
      const value = parseInt(packetValueBits, 2);
      packets.push({ version, typeId, value });
    } else {
      const lengthTypeId = readBits(1);
      if (lengthTypeId === 0) {
        const subPacketsBitLength = readBits(15);
        packets.push({
          version,
          typeId,
          subpackets: readPackets(0, subPacketsBitLength),
        });
      } else if (lengthTypeId === 1) {
        const numSubpackets = readBits(11);
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
