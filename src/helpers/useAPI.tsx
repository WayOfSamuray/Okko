import { useState } from "react";

export const API_KEY = "BrphHnqW47OlnLBamWYkEBDyLk5jDvIfJxuo0MnM";
export const BASE_URL = "https://api.watchmode.com/v1/autocomplete-search/";

export type Movie = {
  id: number;
  name: string;
  image_url?: string;
  year?: number;
  type?: string;
  result_type?: string;
  genre_names?: string[];
};

export type MovieDetailProps = {
  movie: Movie | null;
  onBack: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

export const useApi = () => {
  const [result, setResult] = useState<Movie[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async (searchValue: string) => {
    if (!searchValue.trim()) return;

    setStatus("loading");
    setError(null);

    try {
      const url = `${BASE_URL}?apiKey=${API_KEY}&search_value=${encodeURIComponent(
        searchValue
      )}&search_type=2`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      setResult(data.results || []);
      setStatus("success");
    } catch (e) {
      setError("Не удалось загрузить фильмы, попробуйте позже");
      setStatus("error");
    }
  };

  return { result, status, error, fetchMovies };
};
