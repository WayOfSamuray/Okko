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
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1];
  if (url.includes("v=")) return url.split("v=")[1].split("&")[0];
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

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((e) => console.error("LOAD MOVIES ERROR:", e));
  }, []);

  const prevIndex =
    movies.length > 0 ? (current - 1 + movies.length) % movies.length : 0;

  const nextIndex = movies.length > 0 ? (current + 1) % movies.length : 0;

  useEffect(() => {
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
  }, [current]);

  const nextSlide = () => {
    if (!movies.length) return;
    setCurrent((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    if (!movies.length) return;
    setCurrent((prev) => (prev - 1 + movies.length) % movies.length);
  };

  if (!movies.length) return null;

  const currentMovie = movies[current];
  const prevMovie = movies[prevIndex];
  const nextMovie = movies[nextIndex];

  const youtubeId = getYoutubeId(currentMovie.video);

  return (
    <div className={styles.slider}>
      <div className={`${styles.side} ${styles.left}`}>
        <img src={prevMovie.image} alt="" />
      </div>

      <div
        className={styles.main}
        onClick={() => router.push(`/movie/${currentMovie._id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.mediaWrapper}>
          <img
            src={currentMovie.image}
            className={`${styles.media} ${
              showVideo ? styles.fadeOut : styles.fadeIn
            }`}
          />

          {showVideo && (
            <iframe
              className={styles.media}
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
        </div>

        <div className={styles.overlay} />

        <div
          className={`${styles.content} ${
            !hideInfo || isHovered ? styles.show : styles.hide
          }`}
        >
          <h1 className={styles.title}>{currentMovie.title}</h1>

          <div className={styles.meta}>
            <span className={styles.rating}>
              {currentMovie.averageRating || "—"}
            </span>
            <span>{currentMovie.year || "—"}</span>
            <span>
              {currentMovie.genre?.map((g) => g.name).join(", ") || "—"}
            </span>
            <span>{currentMovie.age || "—"}</span>
          </div>
        </div>
      </div>

      <div className={`${styles.side} ${styles.right}`}>
        <img src={nextMovie.image} alt="" />
      </div>

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
