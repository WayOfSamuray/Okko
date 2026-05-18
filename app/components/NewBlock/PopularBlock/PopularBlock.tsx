"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../NewBlock.module.css";

type Movie = {
  _id: string;
  title: string;
  image: string;
  views: number;
  year: number;
  age: string;
  genre?: { name: string }[];
};

const PopularBlock = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hoveredId, setHoverId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/movies/popular")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch(console.error);
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Самые просматриваемые</h2>

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

              {hoveredId === movie._id && (
                <div className={styles.hoverInfo}>
                  <div className={styles.meta}>
                    👁 {movie.views?.toLocaleString() || 0}
                    <span>{movie.year}</span>
                    <span>{movie.age}</span>
                  </div>
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

export default PopularBlock;
