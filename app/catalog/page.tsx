import Link from "next/link";
import styles from "./Catalog.module.css";

type Genre = {
  name: string;
  slug: string;
};

type Movie = {
  genre: Genre[];
};

export default async function CatalogPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`, {
    cache: "no-store",
  });

  const movies: Movie[] = await res.json();

  const allGenres = movies.flatMap((m) => m.genre || []);

  const uniqueGenres = Array.from(
    new Map(allGenres.map((g) => [g.slug, g])).values(),
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Жанры</h1>

      <div className={styles.grid}>
        {uniqueGenres.map((genre) => (
          <Link
            key={genre.slug}
            href={`/genres/${genre.slug}`}
            className={styles.genre}
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
