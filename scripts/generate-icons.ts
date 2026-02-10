import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const SVG = readFileSync(resolve(ROOT, 'public/favicon.svg'));
const OUT = resolve(ROOT, 'extension/icons');

const sizes = [16, 48, 128] as const;

for (const size of sizes) {
  const out = resolve(OUT, `icon-${size}.png`);
  await sharp(SVG).resize(size, size).png().toFile(out);
  console.log(`wrote ${out}`);
}
