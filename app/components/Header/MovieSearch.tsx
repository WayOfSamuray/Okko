"use client";

import { useEffect, useState } from "react";
import styles from "./MovieSearch.module.css";
import Link from "next/link";
import { Search, X } from "lucide-react";

type Movie = {
  _id: string;
  title: string;
  image?: string;
};

type Props = {
  onClose: () => void;
};

const MovieSearch = ({ onClose }: Props) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => setPopular(data.slice(0, 9)));
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/movies/search?q=${encodeURIComponent(search)}`,
        );

        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className={styles.overlay}>
      <div className={styles.searchContainer}>
        <div className={styles.inputWrapper}>
          {/* 🔍 Иконка поиска */}
          <Search className={styles.searchIcon} size={20} />

          <input
            autoFocus
            placeholder="Название фильма, сериала или актёра"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* ❌ Кнопка закрытия */}
          <button onClick={onClose} className={styles.close}>
            <X size={22} />
          </button>
        </div>

        {search ? (
          <div className={styles.results}>
            {loading ? (
              <p>Поиск...</p>
            ) : results.length > 0 ? (
              results.map((movie) => (
                <Link
                  key={movie._id}
                  href={`/movie/${movie._id}`}
                  onClick={onClose}
                  className={styles.resultItem}
                >
                  {movie.title}
                </Link>
              ))
            ) : (
              <p>Ничего не найдено</p>
            )}
          </div>
        ) : (
          <>
            <h2 className={styles.sectionTitle}>Часто ищут</h2>

            <div className={styles.grid}>
              {popular.map((movie) => (
                <Link
                  key={movie._id}
                  href={`/movie/${movie._id}`}
                  onClick={onClose}
                  className={styles.card}
                >
                  <img src={movie.image} alt={movie.title} />
                  <span>{movie.title}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieSearch;
