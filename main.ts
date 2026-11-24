'use strict';

// The Robot Vacuum's Best Excuse — entry program (Node, zero deps).
// Writes one original one-line excuse to $MAKEFUN_OUTPUT_DIR/entry.txt.

const fs = require('fs');
const path = require('path');

const ENTRY =
  "My bumper tapped that dust, it didn't move, so I logged it as furniture. I don't argue with furniture.";

function codePointLength(s) {
  return [...s].length;
}

const len = codePointLength(ENTRY);
if (len < 1 || len > 140) {
  throw new Error('entry length ' + len + ' code points, must be 1-140');
}
if (ENTRY.trim().length === 0) {
  throw new Error('entry is whitespace-only');
}
if (/[\r\n]/.test(ENTRY)) {
  throw new Error('entry contains a newline');
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const outFile = path.join(outDir, 'entry.txt');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, ENTRY, 'utf8');

const roundTrip = fs.readFileSync(outFile, 'utf8');
if (roundTrip !== ENTRY) {
  throw new Error('round-trip verification failed: written content differs');
}
if (codePointLength(roundTrip) !== len) {
  throw new Error('round-trip verification failed: length differs');
}

// Byte-level checks: exact bytes, and no trailing newline in the file.
const expectedBytes = Buffer.from(ENTRY, 'utf8');
const writtenBytes = fs.readFileSync(outFile);
if (!writtenBytes.equals(expectedBytes)) {
  throw new Error('round-trip verification failed: written bytes differ');
}
if (writtenBytes.length === 0 || writtenBytes[writtenBytes.length - 1] === 0x0a) {
  throw new Error('entry file must not end with a newline');
}
if (writtenBytes.length !== Buffer.byteLength(ENTRY, 'utf8')) {
  throw new Error('round-trip verification failed: byte length differs');
}

console.log('wrote ' + outFile + ' (' + len + ' chars, ' + writtenBytes.length + ' bytes)');
