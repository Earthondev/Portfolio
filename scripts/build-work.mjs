import { build } from "esbuild";
await build({
  entryPoints: ["src/work/projects.ts", "src/work/contact.ts"],
  outdir: "assets/js",
  bundle: true,
  format: "esm",
  minify: true,
  target: "es2022",
});
