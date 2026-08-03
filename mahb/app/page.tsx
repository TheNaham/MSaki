import { getPhotos } from "@/lib/photos";
import PhotoFeed from "@/components/PhotoFeed";

export const revalidate = 0;

export default async function Home() {
  const photos = await getPhotos();

  return (
    <main className="mx-auto max-w-md px-4 pt-8">
      <header className="mb-6 text-center">
        <h1 className="text-lg font-semibold tracking-tight text-gray-800">
          MaHB
        </h1>
        <p className="mt-1 text-xs text-gray-400">회고, 폴라로이드로 남기다</p>
      </header>
      <PhotoFeed photos={photos} />
    </main>
  );
}
