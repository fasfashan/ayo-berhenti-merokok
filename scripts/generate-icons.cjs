// Generates pwa-192x192.png and pwa-512x512.png using only Node.js built-ins.
// Run once: node scripts/generate-icons.js
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

function makeCRC32Table() {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    t[n] = c
  }
  return t
}
const CRC_TABLE = makeCRC32Table()

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xFF]
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function u32be(n) {
  return Buffer.from([(n >>> 24) & 0xFF, (n >>> 16) & 0xFF, (n >>> 8) & 0xFF, n & 0xFF])
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  return Buffer.concat([u32be(data.length), t, data, u32be(crc32(Buffer.concat([t, data])))])
}

function solidPNG(size, r, g, b) {
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
  const ihdr = chunk('IHDR', Buffer.concat([u32be(size), u32be(size), Buffer.from([8, 2, 0, 0, 0])]))

  // Scanlines: 1 filter byte (None=0) + 3 bytes RGB per pixel
  const row = Buffer.alloc(1 + size * 3)
  for (let x = 0; x < size; x++) { row[1 + x * 3] = r; row[2 + x * 3] = g; row[3 + x * 3] = b }
  const raw = Buffer.concat(Array.from({ length: size }, () => row))
  const idat = chunk('IDAT', zlib.deflateSync(raw, { level: 9 }))
  const iend = chunk('IEND', Buffer.alloc(0))

  return Buffer.concat([sig, ihdr, idat, iend])
}

// #2563eb = rgb(37, 99, 235)
const out = path.resolve(__dirname, '../public')
fs.writeFileSync(path.join(out, 'pwa-192x192.png'), solidPNG(192, 37, 99, 235))
fs.writeFileSync(path.join(out, 'pwa-512x512.png'), solidPNG(512, 37, 99, 235))
console.log('✓ pwa-192x192.png and pwa-512x512.png written to public/')
