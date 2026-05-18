"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./NewBlock.module.css";

type Movie = {
  _id: string;
  title: string;
  image: string;
  year: number;
  age: string;
  genre: { name: string }[];
  averageRating?: number;
};

const NewBlock = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hoveredId, setHoverId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/movies/new")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => {
        console.error("Ошибка загрузки новых фильмов:", err);
      });
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Новое в подписке</h2>

      <div className={styles.sliderContainer}>
        {movies.map((movie) => (
          <div
            key={movie._id}
            className={styles.slide}
            onMouseEnter={() => setHoverId(movie._id)}
            onMouseLeave={() => setHoverId(null)}
            onClick={() => router.push(`/movie/${movie._id}`)}
          >
            <div className={styles.imageWrapper}>
              <img
                src={movie.image}
                className={styles.image}
                alt={movie.title}
              />

              <div className={styles.overlay} />

              <div className={styles.topLeft}>
                <span className={styles.newBadge}>Новое</span>
              </div>

              {hoveredId === movie._id && (
                <div className={styles.hoverInfo}>
                  <div className={styles.meta}>
                    <span className={styles.rating}>
                      {movie.averageRating
                        ? movie.averageRating.toFixed(1)
                        : "-"}
                    </span>

                    <span>{movie.year}</span>
                    <span>{movie.age}</span>
                  </div>

                  <div>{movie.genre?.[0]?.name}</div>

                  <button
                    className={styles.detailsBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/movie/${movie._id}`);
                    }}
                  >
                    Подробнее
                  </button>
                </div>
              )}

              <div className={styles.bottomInfo}>
                <div className={styles.titleBottom}>{movie.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewBlock;
