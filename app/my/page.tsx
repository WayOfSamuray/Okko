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
  const [isAuth, setIsAuth] = useState(false);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if(!res.ok) {
        setIsAuth(false);
        setFavorites([]);
        return;
      }
      const data = await res.json();
      setIsAuth(true);
      setFavorites(data.favorites || []);
    } catch (e) {
      console.error(e);
      setIsAuth(false);
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

    {!isAuth ? (
      <div className={styles.emptyBlock}>
        <p className={styles.empty}>
          Войдите в аккаунт, чтобы сохранять фильмы в избранное.
        </p>

        <Link href="/login" className={styles.loginBtn}>
          Войти
        </Link>
      </div>
    ) : favorites.length === 0 ? (
      <p className={styles.empty}>
        У вас пока нет избранных фильмов.
      </p>
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
)};