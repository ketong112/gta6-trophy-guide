// Leonida Trophy Atlas — the entry program (Node 22, standard library only).
//
// What it does: it hands the guide in. It copies this repository's app/ folder
// (the offline guide: index.html, its modules and styles, and data/trophies.json)
// and screenshots/ into the output directory, then writes dossier.json there with
// make.fun's vendored dossier library. The grader runs this program twice and
// both runs must write the same bytes; the scorer then checks the output.
//
// Run it locally to produce the same output the grader sees:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the guide itself with `node serve.ts` and open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function handIn() {
  const appDir = join(repoRoot, 'app');
  if (!existsSync(appDir)) throw new Error('app/ is missing from the repository');
  if (!existsSync(join(appDir, 'index.html'))) throw new Error('app/index.html is missing');
  if (!existsSync(join(appDir, 'data', 'trophies.json'))) throw new Error('app/data/trophies.json is missing');

  mkdirSync(outputDir, { recursive: true });
  cpSync(appDir, join(outputDir, 'app'), { recursive: true });

  const shotsDir = join(repoRoot, 'screenshots');
  mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
  if (existsSync(shotsDir)) cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });
  const shotCount = readdirSync(join(outputDir, 'screenshots')).length;
  if (shotCount < 3 || shotCount > 4) throw new Error(`expected 3 or 4 screenshots, found ${shotCount}`);

  // The gate's own caps for this bounty: the dossier text at most 160 KiB, at
  // most 4 screenshots of at most 256 KiB each, app/ at most 993 files and
  // 48 MiB in all. buildDossier refuses anything past them.
  const dossier = buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  });
  writeFileSync(join(outputDir, 'dossier.json'), dossier);
  console.log(`Handed in ${shotCount} screenshots and the guide to ${outputDir}`);
}

handIn();
