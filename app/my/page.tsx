"use client";

import { useEffect, useState } from "react";
import styles from "./My.module.css";
import Link from "next/link";

type Movie = {
  _id: string;
  title: string;
  image: string;
};

export default function MyPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me", { credentials: "include" });

      if (!res.ok) {
        setFavorites([]);
        return;
      }

      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (e) {
      console.error(e);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (movieId?: string) => {
    if (!movieId) return;

    try {
      await fetch("/api/user/favorite", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });

      loadFavorites();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Моё</h1>

      {favorites.length === 0 ? (
        <p className={styles.empty}>У тебя пока нет избранных фильмов</p>
      ) : (
        <div className={styles.grid}>
          {favorites.map((movie) => (
            <div key={movie._id} className={styles.card}>
              <Link href={`/movie/${movie._id}`}>
                <img src={movie.image} alt={movie.title} />
              </Link>

              <div className={styles.overlay} />

              <div className={styles.info}>
                <p>{movie.title}</p>

                <button
                  onClick={() => removeFavorite(movie._id)}
                  className={styles.remove}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
