import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "photo-originals/door-models";
const OUT = "public/images/durys";
const MANIFEST = "src/lib/door-models.json";
const SIZES = [
  { suffix: "sm", width: 600, quality: 80 },
  { suffix: "lg", width: 1600, quality: 82 },
];
const NAME = /^(classic|elegance|modern)-(\d+)(-fanier)?\.(jpe?g|png|webp|tiff?)$/i;
const STYLE_ORDER = ["classic", "modern", "elegance"];

// The renders have a soft floor shadow, so a plain white trim stops too early.
// Instead find the box around pixels darker than the shadow (the door's outline and handle).
async function doorBox(input) {
  const probeWidth = 960;
  const { width } = await sharp(input).rotate().metadata();
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: probeWidth })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[y * info.width + x] < 225) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return null;
  const scale = width / info.width;
  return {
    left: Math.floor(x0 * scale),
    top: Math.floor(y0 * scale),
    width: Math.ceil((x1 - x0 + 1) * scale),
    height: Math.ceil((y1 - y0 + 1) * scale),
  };
}

const mtime = async (file) => {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return 0;
  }
};

await mkdir(SRC, { recursive: true });
await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => NAME.test(f));
const skipped = (await readdir(SRC)).filter((f) => !NAME.test(f));
for (const f of skipped) console.log(`Skipped (name must look like modern-01.jpg): ${f}`);

const models = new Map();

for (const file of files) {
  const [, style, num, fanier] = file.match(NAME);
  const id = `${style.toLowerCase()}-${num.padStart(2, "0")}`;
  const model = models.get(id) ?? { id, style: style.toLowerCase(), number: Number(num), veneer: false };
  if (fanier) model.veneer = true;
  models.set(id, model);

  const input = path.join(SRC, file);
  const name = path.parse(file).name.toLowerCase();
  const srcTime = await mtime(input);

  for (const { suffix, width, quality } of SIZES) {
    const output = path.join(OUT, `${name}-${suffix}.webp`);
    if ((await mtime(output)) >= srcTime) continue;

    const box = await doorBox(input);
    const cropped = sharp(input).rotate();
    if (box) cropped.extract(box);
    const trimmed = await cropped.toBuffer({ resolveWithObject: true });
    const pad = Math.round(trimmed.info.height * 0.04);
    const info = await sharp(trimmed.data)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: "#ffffff" })
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(output);
    console.log(`${output}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
}

const list = [...models.values()].sort(
  (a, b) => STYLE_ORDER.indexOf(a.style) - STYLE_ORDER.indexOf(b.style) || a.number - b.number,
);
await writeFile(MANIFEST, JSON.stringify(list, null, 2) + "\n");
console.log(`${MANIFEST}: ${list.length} models`);
