import Gallery from "@/components/Gallery";
import { loadPhotos } from "@/lib/photos";

export default async function Home() {
  const photos = await loadPhotos();
  return <Gallery photos={photos} />;
}
