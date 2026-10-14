export type Photo = {
  slug: string;
  id: string;
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
