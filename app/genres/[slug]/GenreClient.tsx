"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./GenrePage.module.css";

type Movie = {
  _id: string;
  title: string;
  image: string;
  averageRating?: number;
  year?: number;
};

type Props = {
  movies: Movie[];
  genreName: string;
};

export default function GenreClient({ movies, genreName }: Props) {
  const [sort, setSort] = useState<"averageRating" | "year">("averageRating");
  const [open, setOpen] = useState(false);

  const sortedMovies = [...movies].sort((a, b) => {
    if (sort === "averageRating") {
      return (b.averageRating || 0) - (a.averageRating || 0);
    }
    return (b.year || 0) - (a.year || 0);
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{genreName}</h1>

        <p>
          В разделе «{genreName}» собраны лучшие фильмы этого жанра — от
          классики до новинок. Откройте для себя захватывающие истории, ярких
          персонажей и атмосферу, которая полностью погружает в мир кино.
          Наслаждайтесь просмотром в высоком качестве без лишних отвлекающих
          факторов.
        </p>

        <div className={styles.sortWrapper}>
          <button className={styles.sortBtn} onClick={() => setOpen(!open)}>
            {sort === "averageRating" ? "По рейтингу" : "По дате выхода"}
          </button>

          {open && (
            <div className={styles.dropdown}>
              <div
                onClick={() => {
                  setSort("year");
                  setOpen(false);
                }}
              >
                По дате выхода
              </div>

              <div
                onClick={() => {
                  setSort("averageRating");
                  setOpen(false);
                }}
              >
                По рейтингу ✓
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {sortedMovies.map((movie) => (
          <Link
            key={movie._id}
            href={`/movie/${movie._id}`}
            className={styles.card}
          >
            <div className={styles.imageWrapper}>
              <img src={movie.image} alt={movie.title} />
            </div>

            <div className={styles.info}>
              <span className={styles.title}>{movie.title}</span>

              <div className={styles.meta}>
                <span>{movie.year}</span>
                <span>{movie.averageRating || "—"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
