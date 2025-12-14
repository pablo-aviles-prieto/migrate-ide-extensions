#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';

function getVSCodeExtensionDirs() {
  const home = os.homedir();
  const platform = os.platform();

  if (platform === 'darwin') {
    return [
      path.join(home, '.vscode/extensions'), // PRIMARY (current)
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

function resolveTargetDir() {
  const arg = process.argv[2];

  if (arg === '--cursor') {
    return path.join(os.homedir(), '.cursor/extensions');
  }

  if (arg === '--antigravity') {
    return path.join(os.homedir(), '.antigravity/extensions');
  }

  console.error('Usage: migrate-ide-extensions --cursor | --antigravity');
  process.exit(1);
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

function askConfirmation(message) {
  return new Promise(resolve => {
    process.stdout.write(message);
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', data => {
      resolve(/^y(es)?$/i.test(data.trim()));
    });
  });
}

/* ---------------- main ---------------- */

const sourceDir = resolveSourceDir();
if (!sourceDir) {
  console.error('No VS Code extensions directory found.');
  process.exit(1);
}

const targetDir = resolveTargetDir();
fs.mkdirSync(targetDir, { recursive: true });

console.log(`Source: ${sourceDir}`);
console.log(`Target: ${targetDir}\n`);

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
