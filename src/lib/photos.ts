import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { photoOverrides } from "./photo-captions";
import type { Photo } from "./photo-types";

const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function humanize(filename: string) {
  const withoutExt = filename.replace(/\.[^.]+$/, "");
  const withoutOrderPrefix = withoutExt.replace(/^\d+[-_]/, "");
  const spaced = withoutOrderPrefix.replace(/[-_]+/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export async function loadPhotos(): Promise<Photo[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(PHOTOS_DIR);
  } catch {
    return [];
  }

  const files = entries
    .filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  const photos = await Promise.all(
    files.map(async (file) => {
      const slug = path.basename(file, path.extname(file));
      const overrideKey = slug.replace(/^\d+[-_]/, "");
      const filePath = path.join(PHOTOS_DIR, file);
      const image = sharp(filePath).rotate();
      const [meta, blurBuffer] = await Promise.all([
        image.clone().metadata(),
        image.clone().resize(16).webp({ quality: 40 }).toBuffer(),
      ]);
      // sharp's .rotate() fixes the pixels for EXIF orientations 5-8 (90°/270°
      // rotations) but .metadata() still reports the pre-rotation dimensions,
      // so the width/height need to be swapped by hand here.
      const swapped = (meta.orientation ?? 1) >= 5;
      const width = (swapped ? meta.height : meta.width) ?? 1;
      const height = (swapped ? meta.width : meta.height) ?? 1;
      const override = photoOverrides[overrideKey] ?? {};
      const fallbackCaption = humanize(file);

      return {
        slug,
        id: overrideKey,
        src: `/photos/${file}`,
        width,
        height,
        blurDataURL: `data:image/webp;base64,${blurBuffer.toString("base64")}`,
        alt: override.alt ?? override.caption ?? fallbackCaption,
        caption: override.caption ?? fallbackCaption,
        film: override.film ?? "",
        camera: override.camera ?? "",
        settings: override.settings ?? "",
        location: override.location ?? "",
        year: override.year ?? "",
        category: override.category ?? "",
      };
    }),
  );

  const seen = new Set<string>();
  for (const p of photos) {
    if (seen.has(p.id)) {
      console.warn(`[photos] id duplicado "${p.id}": links /#${p.id} abrem só a primeira`);
    }
    seen.add(p.id);
  }

  return photos;
}
