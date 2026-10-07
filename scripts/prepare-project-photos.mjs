import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "photo-originals/projektai";
const OUT = "public/images/projektai";
const SIZES = [
  { suffix: "sm", width: 900, quality: 78 },
  { suffix: "lg", width: 2000, quality: 80 },
];
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

const files = (await readdir(SRC)).filter((f) => IMAGE.test(f));
if (files.length === 0) {
  console.log(`Nėra nuotraukų aplanke ${SRC}.`);
}

for (const file of files) {
  const input = path.join(SRC, file);
  const name = path.parse(file).name;
  const srcTime = await mtime(input);

  for (const { suffix, width, quality } of SIZES) {
    const output = path.join(OUT, `${name}-${suffix}.webp`);
    if ((await mtime(output)) >= srcTime) continue;

    const info = await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(output);
    console.log(`${output}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
}
