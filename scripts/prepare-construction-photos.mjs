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

// "Untitled Project 38" (beapvadines-atvirkstines-3d) was rendered with directional light: a grey floor
// shadow and a cast shadow on the door leaf. The other five are flat-lit on white, so this one is evened out.
const SHADOW_FIX = {
  "beapvadines-atvirkstines-3d": { strength: 0.7, gain: 1.1, leaf: [0.44, 0.94, 0.39, 0.99], leafTone: 128 },
};

const raw = (buffer) => sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const fromRaw = (data, width, height) => sharp(data, { raw: { width, height, channels: 3 } }).png().toBuffer();
// sharp returns blurred single-channel images as 3 channels; keep one.
const blurGrey = (data, width, height, sigma) =>
  sharp(data, { raw: { width, height, channels: 1 } }).blur(sigma).extractChannel(0).raw().toBuffer();

// Flattens broad lighting, lifts the tones and fades the neutral grey floor into white.
async function relight(buffer, { strength, gain }) {
  const { data, info } = await raw(buffer);
  const { width, height } = info;
  const px = width * height;
  const grey = new Uint8Array(px);
  let sum = 0;
  let count = 0;
  for (let i = 0; i < px; i++) {
    grey[i] = Math.round((data[i * 3] + data[i * 3 + 1] + data[i * 3 + 2]) / 3);
    if (grey[i] < 245) {
      sum += grey[i];
      count++;
    }
  }
  const mean = sum / count;
  // White background counts as the mean, so the blur doesn't create halos along the object's edges.
  const filled = Buffer.from(grey.map((g) => (g < 245 ? g : Math.round(mean))));
  const light = await blurGrey(filled, width, height, Math.max(width, height) * 0.06);

  const out = Buffer.alloc(px * 3);
  for (let i = 0; i < px; i++) {
    const [r, g, b] = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
    if (grey[i] >= 245) {
      out.fill(255, i * 3, i * 3 + 3);
      continue;
    }
    const neutral = Math.max(r, g, b) - Math.min(r, g, b) < 10;
    const f = Math.pow(mean / Math.max(light[i], 1), strength) * gain;
    const fade = neutral && grey[i] > 200 ? Math.min(1, (grey[i] - 200) / 30) : 0;
    for (let k = 0; k < 3; k++) {
      const v = Math.min(255, data[i * 3 + k] * f);
      out[i * 3 + k] = Math.round(v * (1 - fade) + 255 * fade);
    }
  }
  return fromRaw(out, width, height);
}

// Evens the wood inside a box (fractions of width/height) to one tone, removing a cast shadow.
async function evenWood(buffer, [bx0, bx1, by0, by1], tone) {
  const { data, info } = await raw(buffer);
  const { width, height } = info;
  const px = width * height;
  const lum = Buffer.alloc(px);
  const mask = Buffer.alloc(px);
  for (let y = Math.round(by0 * height); y < Math.round(by1 * height); y++) {
    for (let x = Math.round(bx0 * width); x < Math.round(bx1 * width); x++) {
      const i = y * width + x;
      const [r, g, b] = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
      if (r - b > 20 && r > 40) {
        mask[i] = 255;
        lum[i] = Math.round((r + g + b) / 3);
      }
    }
  }
  const sigma = width * 0.02;
  const [blurredLum, blurredMask] = await Promise.all([
    blurGrey(lum, width, height, sigma),
    blurGrey(mask, width, height, sigma),
  ]);
  const out = Buffer.from(data);
  for (let i = 0; i < px; i++) {
    if (!mask[i] || blurredMask[i] < 8) continue;
    const local = (blurredLum[i] / blurredMask[i]) * 255;
    const f = tone / Math.max(local, 1);
    for (let k = 0; k < 3; k++) out[i * 3 + k] = Math.min(255, Math.round(data[i * 3 + k] * f));
  }
  return fromRaw(out, width, height);
}

// Whitens the floor shadow: everything left of the grey wall and, column by column, below the object.
// Right of the wall only wood (or dark gaps and hinges) belongs to the object; light grey there is shadow.
async function clearFloor(buffer) {
  const { data, info } = await raw(buffer);
  const { width, height } = info;
  const lum = (x, y) => {
    const o = (y * width + x) * 3;
    return (data[o] + data[o + 1] + data[o + 2]) / 3;
  };
  const neutral = (x, y) => {
    const o = (y * width + x) * 3;
    return Math.max(data[o], data[o + 1], data[o + 2]) - Math.min(data[o], data[o + 1], data[o + 2]) < 12;
  };
  const out = Buffer.from(data);
  const whiten = (x, y, t = 1) => {
    const o = (y * width + x) * 3;
    for (let k = 0; k < 3; k++) out[o + k] = Math.round(data[o + k] * (1 - t) + 255 * t);
  };

  const mid = Math.round(height * 0.5);
  let wallLeft = 0;
  while (wallLeft < width && lum(wallLeft, mid) > 200) wallLeft++;
  let wallRight = wallLeft;
  while (wallRight < width && neutral(wallRight, mid)) wallRight++;
  for (let y = mid; y < height; y++) for (let x = 0; x < wallLeft - 1; x++) whiten(x, y);

  const start = Math.round(height * 0.75);
  for (let x = wallLeft; x < width; x++) {
    let y = start;
    let seen = false;
    for (; y < height; y++) {
      const l = lum(x, y);
      const object = x < wallRight ? l < 175 || !neutral(x, y) : (!neutral(x, y) && l < 235) || l < 120;
      if (object) seen = true;
      else if (seen) break;
    }
    if (!seen) {
      for (let yy = start; yy < height; yy++) if (neutral(x, yy) && lum(x, yy) > 150) whiten(x, yy);
      continue;
    }
    // A two-pixel blend keeps the object's bottom edge soft.
    for (let yy = y; yy < height; yy++) whiten(x, yy, yy - y < 2 ? 0.5 + 0.25 * (yy - y) : 1);
  }
  return fromRaw(out, width, height);
}

async function trimRender(input) {
  // The renders sit small in a large white frame; trim it so every image fills its box the same way.
  // Some exports have a 1px grey border, so shave the edges first or trim stops there.
  const { width = 0, height = 0 } = await sharp(input).metadata();
  const inset = 10;
  return sharp(input)
    .rotate()
    .extract({ left: inset, top: inset, width: width - inset * 2, height: height - inset * 2 })
    .toBuffer()
    .then((b) => sharp(b).trim({ threshold: 30 }).toBuffer());
}

await mkdir(SRC, { recursive: true });
await mkdir(OUT, { recursive: true });

for (const file of (await readdir(SRC)).filter((f) => IMAGE.test(f))) {
  const input = path.join(SRC, file);
  const output = path.join(OUT, `${path.parse(file).name}.webp`);
  if ((await mtime(output)) >= (await mtime(input))) continue;

  const name = path.parse(file).name;
  let corrected = await trimRender(input);
  const fix = SHADOW_FIX[name];
  if (fix) corrected = await clearFloor(await evenWood(await relight(corrected, fix), fix.leaf, fix.leafTone));
  const info = await sharp(corrected)
    .resize({ width: WIDTH, height: WIDTH, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(output);
  console.log(`${output}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
}
