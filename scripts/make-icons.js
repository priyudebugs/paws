const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const INK = '#17302a';

// Dog face: same drawing as the mascot's head, cropped to fill the icon.
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="14 22 172 160">
  <path fill="#f6e7d0" stroke="${INK}" stroke-width="7" stroke-linejoin="round" d="M100 30 C142 30 164 58 162 94 C160 128 134 146 100 146 C66 146 40 128 38 94 C36 58 58 30 100 30 Z" />
  <ellipse cx="122" cy="84" rx="21" ry="19" fill="#cf9561" opacity="0.75" />
  <path fill="#cf9561" stroke="${INK}" stroke-width="7" stroke-linejoin="round" d="M54 44 C30 46 18 90 28 116 C34 132 54 126 58 108 C62 90 66 58 54 44 Z" />
  <path fill="#cf9561" stroke="${INK}" stroke-width="7" stroke-linejoin="round" d="M146 44 C170 46 182 90 172 116 C166 132 146 126 142 108 C138 90 134 58 146 44 Z" />
  <ellipse cx="100" cy="117" rx="28" ry="20" fill="#fff8ec" />
  <ellipse cx="80" cy="86" rx="12" ry="13" fill="#fffdf8" stroke="${INK}" stroke-width="5" />
  <ellipse cx="120" cy="86" rx="12" ry="13" fill="#fffdf8" stroke="${INK}" stroke-width="5" />
  <circle cx="80" cy="88" r="7" fill="${INK}" />
  <circle cx="120" cy="88" r="7" fill="${INK}" />
  <circle cx="82.6" cy="85" r="2.2" fill="#fffdf8" />
  <circle cx="122.6" cy="85" r="2.2" fill="#fffdf8" />
  <path d="M90 104 Q100 98 110 104 Q108 113 100 115 Q92 113 90 104 Z" fill="${INK}" />
  <path d="M100 115 V121 M89 122 Q94.5 128 100 121 Q105.5 128 111 122" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M68 150 Q100 170 132 150" fill="none" stroke="#2e6a4f" stroke-width="10" stroke-linecap="round" />
  <circle cx="100" cy="166" r="8" fill="#d9572b" stroke="${INK}" stroke-width="4" />
</svg>`;

async function render(size, out) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svg), { density: 600 }).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(out);
  console.log('wrote', path.relative(root, out));
}

// NSIS only accepts 24-bit BMP for installer artwork.
async function renderBmp(svgText, width, height, out) {
  const { data } = await sharp(Buffer.from(svgText), { density: 300 }).resize(width, height).flatten({ background: '#ffffff' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rowSize = Math.ceil((width * 3) / 4) * 4;
  const bmp = Buffer.alloc(54 + rowSize * height);
  bmp.write('BM', 0);
  bmp.writeUInt32LE(bmp.length, 2);
  bmp.writeUInt32LE(54, 10);
  bmp.writeUInt32LE(40, 14);
  bmp.writeInt32LE(width, 18);
  bmp.writeInt32LE(height, 22);
  bmp.writeUInt16LE(1, 26);
  bmp.writeUInt16LE(24, 28);
  bmp.writeUInt32LE(rowSize * height, 34);
  for (let y = 0; y < height; y++) {
    const row = 54 + (height - 1 - y) * rowSize;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      bmp[row + x * 3] = data[i + 2];
      bmp[row + x * 3 + 1] = data[i + 1];
      bmp[row + x * 3 + 2] = data[i];
    }
  }
  fs.writeFileSync(out, bmp);
  console.log('wrote', path.relative(root, out));
}

const dogInner = svg.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const paw = (x, y, s, r) =>
  `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" fill="${INK}" opacity="0.1"><ellipse cx="12" cy="16.2" rx="5.6" ry="4.6"/><ellipse cx="5.2" cy="10.6" rx="2.3" ry="2.9"/><ellipse cx="9.4" cy="6.4" rx="2.3" ry="3"/><ellipse cx="14.6" cy="6.4" rx="2.3" ry="3"/><ellipse cx="18.8" cy="10.6" rx="2.3" ry="2.9"/></g>`;

const sidebar = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 164 314">
  <rect width="164" height="314" fill="#dfeae3"/>
  <rect y="214" width="164" height="100" fill="#f1f4f2"/>
  ${paw(18, 236, 1, -18)}${paw(58, 262, 1, 10)}${paw(98, 240, 1, -6)}${paw(126, 272, 1, 16)}${paw(30, 286, 1, 4)}
  <svg x="22" y="58" width="120" height="112" viewBox="14 22 172 160">${dogInner}</svg>
</svg>`;

const header = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 57">
  <rect width="150" height="57" fill="#ffffff"/>
  <svg x="92" y="4" width="52" height="49" viewBox="14 22 172 160">${dogInner}</svg>
</svg>`;

(async () => {
  await render(512, path.join(root, 'build', 'icon.png'));
  await render(256, path.join(root, 'assets', 'icon.png'));
  await render(32, path.join(root, 'assets', 'tray.png'));
  await renderBmp(sidebar, 164, 314, path.join(root, 'build', 'installerSidebar.bmp'));
  await renderBmp(header, 150, 57, path.join(root, 'build', 'installerHeader.bmp'));
})();
