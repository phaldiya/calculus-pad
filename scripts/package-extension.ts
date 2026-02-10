import { execFileSync } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = resolve(ROOT, 'dist-extension');
const ZIP = resolve(ROOT, 'calculus-pad-extension.zip');

if (!existsSync(DIST)) {
  console.error('dist-extension/ not found — run `bun run build:extension` first.');
  process.exit(1);
}

if (existsSync(ZIP)) {
  unlinkSync(ZIP);
}

execFileSync('zip', ['-r', ZIP, '.'], { cwd: DIST, stdio: 'inherit' });
console.log(`\nPackaged → ${ZIP}`);
