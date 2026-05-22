"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MainSlider.module.css";
import { useRouter } from "next/navigation";

type Genre = {
  name: string;
  slug: string;
};

type Movie = {
  _id: string;
  title: string;
  image: string;
  video: string;
  averageRating: number;
  year: number;
  genre: Genre[];
  age: string;
};

const getYoutubeId = (url: string) => {
  if (!url) return "";
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1]?.split("?")[0];
  if (url.includes("v=")) return url.split("v=")[1]?.split("&")[0];
  return url;
};

const MainSlider = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [current, setCurrent] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [hideInfo, setHideInfo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Загрузка фильмов
  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMovies(data);
        }
      })
      .catch((e) => console.error("LOAD MOVIES ERROR:", e));
  }, []);

  // Автосмена слайда + видео
  useEffect(() => {
    if (!movies.length) return;

    setShowVideo(false);
    setHideInfo(false);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setShowVideo(true);
      setHideInfo(true);
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, movies.length]);

  const nextSlide = () => {
    if (!movies.length) return;
    setCurrent((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    if (!movies.length) return;
    setCurrent((prev) => (prev - 1 + movies.length) % movies.length);
  };

  // Защита от пустого массива
  if (!movies.length) return null;

  const currentMovie = movies[current];
  const prevMovie = movies[(current - 1 + movies.length) % movies.length];
  const nextMovie = movies[(current + 1) % movies.length];

  const youtubeId = getYoutubeId(currentMovie?.video || "");

  // Функция безопасного рендера изображения
  const renderImage = (movie: Movie | undefined, className = "", alt = "") => {
    if (!movie?.image) {
      return <div className={styles.placeholder} />;
    }
    return (
      <img
        src={movie.image}
        alt={alt || movie.title || "Movie"}
        className={className}
        loading="eager"
      />
    );
  };

  return (
    <div className={styles.slider}>
      {/* Левая сторона */}
      <div className={`${styles.side} ${styles.left}`}>
        {renderImage(prevMovie, "", "Previous movie")}
      </div>

      {/* Главный слайд */}
      <div
        className={styles.main}
        onClick={() => router.push(`/movie/${currentMovie?._id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.mediaWrapper}>
          {/* Основное изображение */}
          {renderImage(
            currentMovie,
            `${styles.media} ${showVideo ? styles.fadeOut : styles.fadeIn}`
          )}

          {/* Видео */}
          {showVideo && youtubeId && (
            <iframe
              className={styles.media}
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
        </div>

        <div className={styles.overlay} />

        {/* Информация о фильме */}
        <div
          className={`${styles.content} ${
            !hideInfo || isHovered ? styles.show : styles.hide
          }`}
        >
          <h1 className={styles.title}>{currentMovie?.title}</h1>

          <div className={styles.meta}>
            <span className={styles.rating}>
              {currentMovie?.averageRating?.toFixed(1) || "—"}
            </span>
            <span>{currentMovie?.year || "—"}</span>
            <span>
              {currentMovie?.genre?.map((g) => g.name).join(", ") || "—"}
            </span>
            <span>{currentMovie?.age || "—"}</span>
          </div>
        </div>
      </div>

      {/* Правая сторона */}
      <div className={`${styles.side} ${styles.right}`}>
        {renderImage(nextMovie, "", "Next movie")}
      </div>

      {/* Кнопки управления */}
      <button className={styles.prev} onClick={prevSlide}>
        ‹
      </button>
      <button className={styles.next} onClick={nextSlide}>
        ›
      </button>
    </div>
  );
};

export default MainSlider;