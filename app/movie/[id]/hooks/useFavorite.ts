"use client";

import { useEffect, useState } from "react";

export const useFavorite = (movie: any) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const checkFavorite = async () => {
    if (!movie?._id) return;

    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });

    if (!res.ok) return;

    const user = await res.json();

    const exists = user.favorites?.some(
      (fav: any) => String(fav._id) === String(movie._id), // ❗ было fav.id
    );

    setIsFavorite(exists);
  };

  useEffect(() => {
    checkFavorite();
  }, [movie?._id]);

  const toggleFavorite = async () => {
    if (!movie?._id) return;

    setIsFavorite((prev) => !prev);

    await fetch("/api/user/favorite", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movieId: movie._id,
      }),
    });
  };

  return { isFavorite, toggleFavorite };
};
