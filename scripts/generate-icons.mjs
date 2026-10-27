#!/usr/bin/env node
/**
 * Draws the app icons from the pixel mark. No dependencies: the mark is a
 * 12-cell pixel grid, so the PNGs are written directly with Node's zlib.
 *
 * Usage:  node scripts/generate-icons.mjs
 * Regenerate rather than edit the PNGs by hand.
 *
 * The mark is the lavender sprig from sebthecanadian.ca (violet florets,
 * lilac highlights, forest-green stems) on parchment. One image has to serve
 * both light and dark mode, so it is the light-mode mark; favicon.svg carries
 * both marks and switches with the device colour scheme.
 *
 * Output (public/):
 *   icons/icon-512.png   512 px, app icon; also used as the maskable icon, so
 *                        the art stays inside the central 80 % safe zone
 *   icons/icon-192.png   192 px, app icon
 *   apple-touch-icon.png 180 px, iOS home screen
 *   favicon.ico          32 px, for browsers that do not read SVG favicons
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const PARCHMENT = [245, 242, 235];
const INKS = {
  F: [91, 63, 163], // violet florets
  H: [138, 82, 204], // lilac highlights
  S: [61, 107, 52], // forest-green stems
};

// The sprig on its 12-cell grid. The art is 11 cells wide, so it is drawn
// half a cell to the right to sit in the middle.
const SPRIG = [
  '.....H......',
  '....FHF.....',
  '.H...F...H..',
  'FHF.FHF.FHF.',
  '.F...F...F..',
  'FHF.FHF.FHF.',
  '.F...F...F..',
  'FHF..S..FHF.',
  '.S...S...S..',
  '..S..S..S...',
  '...SSSSS....',
  '.....S......',
];

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

/** Encode an RGB pixel buffer (3 bytes per pixel, row-major) as a PNG. */
function png(size, rgb) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // colour type: RGB
  const stride = size * 3;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** The sprig on parchment: a square of `size` px with cells of `unit` px. */
function icon(size, unit) {
  const rgb = Buffer.alloc(size * size * 3);
  for (let i = 0; i < size * size; i++) rgb.set(PARCHMENT, i * 3);
  const grid = SPRIG.length * unit;
  const left = Math.round((size - grid) / 2 + unit / 2);
  const top = Math.round((size - grid) / 2);
  SPRIG.forEach((row, cy) => {
    [...row].forEach((cell, cx) => {
      const ink = INKS[cell];
      if (!ink) return;
      for (let y = top + cy * unit; y < top + (cy + 1) * unit; y++) {
        for (let x = left + cx * unit; x < left + (cx + 1) * unit; x++) {
          rgb.set(ink, (y * size + x) * 3);
        }
      }
    });
  });
  return png(size, rgb);
}

/** Wrap one PNG in an ICO container (a PNG inside an ICO is read by every current browser). */
function ico(pngData, size) {
  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // type: icon
  dir.writeUInt16LE(1, 4); // one image
  const entry = Buffer.alloc(16);
  entry[0] = size; // width
  entry[1] = size; // height
  entry[2] = 0; // palette size
  entry[3] = 0; // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(24, 6); // bits per pixel
  entry.writeUInt32LE(pngData.length, 8);
  entry.writeUInt32LE(dir.length + entry.length, 12); // offset of the image data
  return Buffer.concat([dir, entry, pngData]);
}

mkdirSync(join(PUBLIC, 'icons'), { recursive: true });
const outputs = [
  ['icons/icon-512.png', icon(512, 28)],
  ['icons/icon-192.png', icon(192, 10)],
  ['apple-touch-icon.png', icon(180, 10)],
  ['favicon.ico', ico(icon(32, 2), 32)],
];
for (const [name, data] of outputs) {
  writeFileSync(join(PUBLIC, name), data);
  console.log(`${name}\t${data.length} bytes`);
}
