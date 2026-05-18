"use client";

import { useEffect, useState } from "react";
import styles from "./Rating.module.css";
import { X } from "lucide-react";

const Rating = ({ movieId }: { movieId: string }) => {
  const [hover, setHover] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);

  const loadRating = async () => {
    const res = await fetch(`/api/rating?movieId=${movieId}`, {
      credentials: "include",
    });

    const data = await res.json();

    setAverage(data.average);
    setCount(data.count);
    setMyRating(data.myRating);
  };

  useEffect(() => {
    loadRating();
  }, [movieId]);

  const rate = async (value: number) => {
    await fetch("/api/rating", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId, value }),
    });

    loadRating();
  };

  const resetRating = async () => {
    await fetch("/api/rating", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId }),
    });

    loadRating();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3 className={styles.title}>
          ✩ {average ? average.toFixed(1) : "0"} ({count})
        </h3>

        <p className={styles.subtitle}>
          {myRating ? `Вы поставили: ${myRating}` : "Оцените фильм"}
        </p>

        <div className={styles.stars}>
          {[...Array(10)].map((_, i) => {
            const value = i + 1;
            const isActive =
              hover > 0
                ? value <= hover
                : myRating > 0
                  ? value <= myRating
                  : value <= Math.round(average);

            return (
              <span
                key={value}
                className={`${styles.star} ${isActive ? styles.active : ""}`}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
                onClick={() => rate(value)}
              >
                ★
              </span>
            );
          })}
        </div>

        {myRating > 0 && (
          <button
            className={styles.resetIcon}
            onClick={resetRating}
            title="Удалить оценку"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Rating;
