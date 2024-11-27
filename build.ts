// woah! so this just builds the vite script and then copies the dist folder to the server/public folder!!!!
// works well actually, what
import { fileURLToPath } from "url";
import { dirname } from "path";
import { build } from "vite";
import { resolve } from "path";
import { copy } from "fs-extra";
import { exec } from "child_process";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = resolve(__dirname, ".");
const dist = resolve(__dirname, ".", "dist");
const serverPublic = resolve(__dirname, ".", "server/server/public");

async function main() {
  await build({
    root,
    build: {
      outDir: dist,
    },
  });
  await copy(dist, serverPublic);

  const execAsync = promisify(exec);

  const std = await execAsync("npx prisma generate", {
    cwd: resolve(__dirname, "server"),
  });

  console.log("done", std);
}

main();
