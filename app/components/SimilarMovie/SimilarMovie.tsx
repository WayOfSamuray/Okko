"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "./SimilarMovie.module.css";

type Genre = {
  name: string;
  slug: string;
};

type Movie = {
  _id: string;
  title: string;
  image: string;
  genre?: Genre[];
};

type Props = {
  currentId: string;
  genres: Genre[];
};

const SimilarMovies = ({ currentId, genres }: Props) => {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/movies");

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setMovies(data);
      } catch (e) {
        console.error("SIMILAR MOVIES ERROR:", e);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if(!slider) return;

    const handleWheel = (e: WheelEvent) => {
      if(Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        slider.scrollLeft += e.deltaY;
      }
    }
    slider.addEventListener('wheel', handleWheel, {
      passive: false,
    })
    return () => {
      slider.removeEventListener('wheel', handleWheel)
    }
  }, [])

  const similarMovies = useMemo(() => {
    if (!genres.length) return [];

    return movies
      .filter((item) => {
        if (item._id === currentId) return false;

        return item.genre?.some((g) => genres.some((cg) => cg.slug === g.slug));
      })
      .slice(0, 10);
  }, [movies, currentId, genres]);

  if (!similarMovies.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Смотрите также</h2>

      <div ref={sliderRef} className={styles.list}>
        {similarMovies.map((item) => (
          <div
            key={item._id}
            className={styles.card}
            onClick={() => router.push(`/movie/${item._id}`)}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={200}
              height={300}
              className={styles.image}
            />

            <div className={styles.name}>{item.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SimilarMovies;
