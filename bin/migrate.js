#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';

function getVSCodeExtensionDirs() {
  const home = os.homedir();
  const platform = os.platform();

  if (platform === 'darwin') {
    return [
      path.join(home, '.vscode/extensions'),
      path.join(home, 'Library/Application Support/Code/extensions'),
      path.join(home, 'Library/Application Support/Code - Insiders/extensions'),
      path.join(home, 'Library/Application Support/VSCodium/extensions'),
    ];
  }

  if (platform === 'linux') {
    return [path.join(home, '.vscode/extensions'), path.join(home, '.vscode-insiders/extensions')];
  }

  if (platform === 'win32') {
    return [path.join(home, '.vscode/extensions')];
  }

  return [];
}

function resolveSourceDir() {
  return getVSCodeExtensionDirs().find(dir => fs.existsSync(dir));
}

function resolveTargetDir(target) {
  if (target === 'cursor') {
    return path.join(os.homedir(), '.cursor/extensions');
  }

  if (target === 'antigravity') {
    return path.join(os.homedir(), '.antigravity/extensions');
  }

  return null;
}

function scanExtensions(source, target) {
  const entries = fs.readdirSync(source, { withFileTypes: true });

  return entries
    .filter(e => e.isDirectory())
    .map(e => {
      const src = path.join(source, e.name);
      const dest = path.join(target, e.name);
      return {
        name: e.name,
        src,
        dest,
        exists: fs.existsSync(dest),
      };
    });
}

function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function askConfirmation(message) {
  return askQuestion(message).then(answer => /^y(es)?$/i.test(answer));
}

async function selectTarget() {
  const arg = process.argv[2];

  // If argument provided, use it
  if (arg === '--cursor') return 'cursor';
  if (arg === '--antigravity') return 'antigravity';

  // Otherwise, prompt the user
  console.log('Select migration target:');
  console.log('  1) Cursor');
  console.log('  2) Antigravity');

  const answer = await askQuestion('\nEnter your choice (1 or 2): ');

  if (answer === '1') return 'cursor';
  if (answer === '2') return 'antigravity';

  console.error('\nInvalid selection. Please run again and choose 1 or 2.');
  process.exit(1);
}

/* ---------------- main ---------------- */

(async () => {
  const sourceDir = resolveSourceDir();
  if (!sourceDir) {
    console.error('No VS Code extensions directory found.');
    process.exit(1);
  }

  const target = await selectTarget();
  const targetDir = resolveTargetDir(target);

  fs.mkdirSync(targetDir, { recursive: true });

  console.log(`\nSource: ${sourceDir}`);
  console.log(`Target: ${targetDir} (${target})\n`);

  const extensions = scanExtensions(sourceDir, targetDir);
  const toCopy = extensions.filter(e => !e.exists);
  const skipped = extensions.filter(e => e.exists);

  console.log(`Found ${extensions.length} extensions`);
  console.log(`→ ${toCopy.length} will be copied`);
  console.log(`→ ${skipped.length} already exist\n`);

  if (toCopy.length === 0) {
    console.log('Nothing to copy.');
    process.exit(0);
  }

  toCopy.forEach(e => console.log(`  + ${e.name}`));

  const confirmed = await askConfirmation('\nProceed? (y/N): ');
  if (!confirmed) {
    console.log('Aborted.');
    process.exit(0);
  }

  /* ---------------- COPY HAPPENS HERE ---------------- */

  for (const ext of toCopy) {
    console.log(`→ Copying ${ext.name}`);
    fs.cpSync(ext.src, ext.dest, { recursive: true });
  }

  console.log('\n✅ Done!');
  process.exit(0);
})();
