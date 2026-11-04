import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "photo-originals/konstrukcijos";
const OUT = "public/images/konstrukcijos";
const WIDTH = 1000;
const IMAGE = /\.(jpe?g|png|webp|tiff?)$/i;

const mtime = async (file) => {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return 0;
  }
};

await mkdir(SRC, { recursive: true });
await mkdir(OUT, { recursive: true });

for (const file of (await readdir(SRC)).filter((f) => IMAGE.test(f))) {
  const input = path.join(SRC, file);
  const output = path.join(OUT, `${path.parse(file).name}.webp`);
  if ((await mtime(output)) >= (await mtime(input))) continue;

  // The renders sit small in a large white frame; trim it so every image fills its box the same way.
  // Some exports have a 1px grey border, so shave the edges first or trim stops there.
  const { width = 0, height = 0 } = await sharp(input).metadata();
  const inset = 10;
  const trimmed = await sharp(input)
    .rotate()
    .extract({ left: inset, top: inset, width: width - inset * 2, height: height - inset * 2 })
    .toBuffer()
    .then((b) => sharp(b).trim({ threshold: 30 }).toBuffer());
  const info = await sharp(trimmed)
    .resize({ width: WIDTH, height: WIDTH, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(output);
  console.log(`${output}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
}
