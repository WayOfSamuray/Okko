import { headers } from "next/headers";
import GenreClient from "./GenreClient";

type Genre = {
  name: string;
  slug: string;
};

type Movie = {
  _id: string;
  title: string;
  image: string;
  averageRating?: number;
  year?: number;
  genre?: Genre[];
};

type Props = {
  params: Promise<{ slug: string }>;
};

const normalize = (s?: string) => (s || "").toLowerCase().trim();

export default async function GenrePage({ params }: Props) {
  const { slug: rawSlug } = await params;

  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/movies`, {
    cache: "no-store",
  });

  const movies: Movie[] = await res.json();

  const slug = normalize(rawSlug);

  const filteredMovies = movies.filter(
    (movie) =>
      Array.isArray(movie.genre) &&
      movie.genre.some((g) => normalize(g.slug) === slug),
  );

  const genreName =
    movies.flatMap((m) => m.genre || []).find((g) => normalize(g.slug) === slug)
      ?.name || rawSlug;

  return <GenreClient movies={filteredMovies} genreName={genreName} />;
}
