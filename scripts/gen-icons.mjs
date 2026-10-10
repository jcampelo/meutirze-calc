import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const publicDir = join(root, 'public');
const iconsDir = join(publicDir, 'icons');

mkdirSync(iconsDir, { recursive: true });

const svgBuffer = readFileSync(join(publicDir, 'icon.svg'));

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(iconsDir, `icon-${size}.png`));
  console.log(`Generated icon-${size}.png`);
}

// Maskable icon (with padding ~10% for safe zone)
for (const size of [192, 512]) {
  const padding = Math.round(size * 0.1);
  const inner = size - padding * 2;
  await sharp(svgBuffer)
    .resize(inner, inner)
    .extend({ top: padding, bottom: padding, left: padding, right: padding, background: '#f7fbf7' })
    .png()
    .toFile(join(iconsDir, `icon-maskable-${size}.png`));
  console.log(`Generated icon-maskable-${size}.png`);
}

console.log('Done!');
