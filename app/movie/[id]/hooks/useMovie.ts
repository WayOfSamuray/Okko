import { useEffect, useState } from "react";

export const useMovie = (id: string) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      });
  }, []);

  const movie = movies.find((m) => String(m._id) === String(id));

  return { movie, loading };
};
