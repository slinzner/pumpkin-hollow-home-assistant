import { cp, mkdir, rm } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('build/hacs-companion/', root);

// Use a fixed output directory and an explicit file list. Never export local
// Home Assistant configuration, Git history, or development dependencies.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const path of ['hacs.json', 'README.md', '.github', 'dist']) {
  await cp(new URL(`packages/companion/${path}`, root), new URL(path, output), {
    recursive: true,
  });
}
await cp(new URL('LICENSE', root), new URL('LICENSE', output));

await mkdir(new URL('docs/screenshots/', output), { recursive: true });
for (const name of ['overview-desktop.jpg', 'controls-desktop.jpg']) {
  await cp(new URL(`docs/screenshots/${name}`, root), new URL(`docs/screenshots/${name}`, output));
}

console.log('Companion repository prepared in build/hacs-companion/');
