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

const FORCE = process.argv.includes("--force");

// 3:4 frame centred on the door, sized from the door alone so every door comes out the same size.
// Missing height is padded with white; spare height is cropped evenly around the door.
const FRAME_HALF_WIDTH = 0.48; // of the door height; the door fills about 78% of the frame height
async function doorFrame(input) {
  const { width, height } = await sharp(input).rotate().metadata();
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: 960 })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const box = (threshold) => {
    let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (data[y * info.width + x] < threshold) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    return x1 < 0 ? null : { x0, y0, x1, y1 };
  };
  const door = box(225);
  if (!door) return null;

  const scale = width / info.width;
  const center = ((door.x0 + door.x1 + 1) / 2) * scale;
  const half = Math.min((door.y1 - door.y0 + 1) * scale * FRAME_HALF_WIDTH, center, width - center);
  const left = Math.round(center - half);
  const cropWidth = Math.round(half * 2);
  const frameHeight = Math.round((cropWidth * 4) / 3);
  const above = door.y0 * scale;
  const below = height - (door.y1 + 1) * scale;

  if (frameHeight <= height) {
    const doorMiddle = (above + (height - below)) / 2;
    const top = Math.round(Math.min(Math.max(doorMiddle - frameHeight / 2, 0), height - frameHeight));
    return { extract: { left, top, width: cropWidth, height: frameHeight }, padTop: 0, padBottom: 0 };
  }

  const extra = frameHeight - height;
  // Split the added height so the door sits in the vertical middle.
  const padTop = Math.min(extra, Math.max(0, Math.round((extra + below - above) / 2)));
  return { extract: { left, top: 0, width: cropWidth, height }, padTop, padBottom: extra - padTop };
}

// The painted renders sit on a grey studio floor that the crop cuts through. Fading the left, right and
// bottom edges into white keeps the shadow soft and leaves no visible image edge on the page.
function edgeFade(width, height) {
  const stops = (from, to) =>
    `<stop offset="${from}" stop-color="#fff"/><stop offset="${to}" stop-color="#fff" stop-opacity="0"/>`;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs>` +
      `<linearGradient id="l" x1="0" y1="0" x2="1" y2="0">${stops(0, 0.12)}</linearGradient>` +
      `<linearGradient id="r" x1="1" y1="0" x2="0" y2="0">${stops(0, 0.12)}</linearGradient>` +
      `<linearGradient id="b" x1="0" y1="1" x2="0" y2="0">${stops(0, 0.1)}</linearGradient>` +
      `</defs><rect width="100%" height="100%" fill="url(#l)"/><rect width="100%" height="100%" fill="url(#r)"/>` +
      `<rect width="100%" height="100%" fill="url(#b)"/></svg>`,
  );
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
    if (!FORCE && (await mtime(output)) >= srcTime) continue;

    const frame = await doorFrame(input);
    const image = sharp(input).rotate();
    if (frame) image.extract(frame.extract);
    const raw = await image.toBuffer();
    const { width: w, height: h } = await sharp(raw).metadata();
    const cropped = await sharp(raw).composite([{ input: edgeFade(w, h) }]).toBuffer();
    // sharp resizes before extending within one pipeline, so pad in a separate pass.
    const padded = await sharp(cropped)
      .extend({ top: frame?.padTop ?? 0, bottom: frame?.padBottom ?? 0, background: "#ffffff" })
      .toBuffer();
    const info = await sharp(padded)
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
