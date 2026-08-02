import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { photoOverrides } from "./photo-captions";

export type Photo = {
  slug: string;
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  alt: string;
  caption: string;
  film: string;
  camera: string;
  settings: string;
  location: string;
  year: string;
  category: string;
};

export type PhotoRow = { k: string; v: string };

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

  return Promise.all(
    files.map(async (file) => {
      const slug = path.basename(file, path.extname(file));
      const filePath = path.join(PHOTOS_DIR, file);
      const image = sharp(filePath).rotate();
      const [{ width, height }, blurBuffer] = await Promise.all([
        image.clone().metadata(),
        image.clone().resize(16).webp({ quality: 40 }).toBuffer(),
      ]);
      const override = photoOverrides[slug] ?? {};
      const fallbackCaption = humanize(file);

      return {
        slug,
        src: `/photos/${file}`,
        width: width ?? 1,
        height: height ?? 1,
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
}

export function rowsFor(p: Photo): PhotoRow[] {
  const defs: [string, string][] = [
    ["Filme", p.film],
    ["Câmera", p.camera],
    ["Config.", p.settings],
    ["Local", p.location],
    ["Ano", p.year],
    ["Categoria", p.category],
  ];
  return defs.filter(([, v]) => v).map(([k, v]) => ({ k, v }));
}
