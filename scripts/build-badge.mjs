import { build } from "esbuild";
import { mkdir, readdir, unlink } from "node:fs/promises";
const outdir = "assets/js/badge";
await mkdir(outdir, { recursive: true });
for (const file of await readdir(outdir)) {
  if (file.endsWith(".js")) await unlink(`${outdir}/${file}`);
}
await build({
  entryPoints: { entry: "src/badge/entry.ts", studio: "src/studio/entry.ts" },
  outdir,
  bundle: true,
  splitting: true,
  format: "esm",
  minify: true,
  target: "es2022",
  chunkNames: "[name]-[hash]",
  legalComments: "eof",
  metafile: false,
});
console.log("Built the locally bundled badge scene.");
