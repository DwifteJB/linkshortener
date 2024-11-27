// woah! so this just builds the vite script and then copies the dist folder to the server/public folder!!!!
// works well actually
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { build } from 'vite';
import { resolve } from 'path';
import { copy } from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = resolve(__dirname, '.');
const dist = resolve(__dirname, '.', 'dist');
const serverPublic = resolve(__dirname, '.', 'server/server/public');

async function main() {
  await build({
    root,
    build: {
      outDir: dist,
    },
  });
  await copy(dist, serverPublic);
}

main();