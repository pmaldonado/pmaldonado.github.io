// Prepare photos for the site: `npm run photos:add -- ~/Desktop/sunset.jpg [more files...]`
//
// For each file this:
//   - applies the EXIF rotation, then strips all metadata (GPS location, camera serial, etc.),
//   - shrinks it to at most 2400px on the long edge (the build makes smaller sizes from that),
//   - saves it as src/content/photos/<name>.jpg,
//   - appends an entry to src/content/photos/photos.yaml with an empty `alt` to fill in.
//
// The originals are left untouched. iPhone HEIC files aren't supported; export them as JPEG first.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PHOTOS_DIR = path.resolve(import.meta.dirname, "../src/content/photos");
const YAML_PATH = path.join(PHOTOS_DIR, "photos.yaml");
const MAX_EDGE = 2400;

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: npm run photos:add -- <photo> [more photos...]");
  process.exit(1);
}

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "photo";

let yaml = readFileSync(YAML_PATH, "utf8");
// The collection starts out as an empty list (`[]`); drop it before appending list items.
yaml = yaml.replace(/^\[\]\s*$/m, "").trimEnd() + "\n";

for (const file of files) {
  let id = slugify(path.parse(file).name);
  for (let n = 2; existsSync(path.join(PHOTOS_DIR, `${id}.jpg`)); n++) {
    id = `${slugify(path.parse(file).name)}-${n}`;
  }
  const out = path.join(PHOTOS_DIR, `${id}.jpg`);

  // sharp drops all metadata unless asked to keep it, so the output has no EXIF/GPS data.
  const info = await sharp(file)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(out);

  yaml += `\n- id: ${id}\n  src: ./${id}.jpg\n  alt: "" # TODO: describe the photo\n  # caption:\n  # date:\n`;
  console.log(`Added ${path.relative(process.cwd(), out)} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
}

writeFileSync(YAML_PATH, yaml);
console.log(`\nFill in the alt text (and optional caption/date) in ${path.relative(process.cwd(), YAML_PATH)}.`);
