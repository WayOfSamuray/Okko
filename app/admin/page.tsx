"use client";

import { useState, useEffect } from "react";
import styles from "./Admin.module.css";
import CountrySelect from "./CountrySelect";
import GenreSelect from "./genres/GenreSelect";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";

type FormState = {
  title: string;
  interName: string;
  image: string;
  video: string;
  year: string;
  age: string;
  director: string;
  actors: string;
  desc: string;
  premiere: string;
  country: string;
  writers: string;
  audio: string;
  videoQuality: string;
  genre: any[];
};

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuth } = useAuth();

  useEffect(() => {
    if (!isAuth) {
      router.replace("/");
      return;
    }

    if (user?.id !== "69e28386b57d3d2a9796d055") {
      router.replace("/");
    }
  }, [isAuth, user, router]);

  if (!isAuth || user?.id !== "69e28386b57d3d2a9796d055") {
    return null;
  }

  const [form, setForm] = useState<FormState>({
    title: "",
    interName: "",
    image: "",
    video: "",
    year: "",
    age: "16+",
    director: "",
    actors: "",
    desc: "",
    premiere: "",
    country: "",
    writers: "",
    audio: "Русский",
    videoQuality: "HD",
    genre: [],
  });

  const handleChange = (key: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toArray = (value: string) =>
    value
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

  const handleSubmit = async () => {
    try {
      const movieData = {
        title: form.title,
        interName: form.interName || undefined,
        image: form.image,
        video: form.video,
        desc: form.desc,

        year: form.year ? Number(form.year) : undefined,

        age: form.age || undefined,

        premiere: form.premiere || undefined,
        director: form.director || undefined,

        actors: toArray(form.actors),
        country: toArray(form.country),
        writers: toArray(form.writers),

        genre: form.genre,

        audio: form.audio || undefined,
        videoQuality: form.videoQuality || undefined,
      };

      const res = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API ERROR:", data);
        throw new Error(data?.message || "Ошибка сервера");
      }

      alert("Фильм добавлен 🚀");

      setForm({
        title: "",
        interName: "",
        image: "",
        video: "",
        year: "",
        age: "",
        director: "",
        actors: "",
        desc: "",
        premiere: "",
        country: "",
        writers: "",
        audio: "",
        videoQuality: "",
        genre: [],
      });
    } catch (e) {
      console.error(e);
      alert("Ошибка при добавлении");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎬 Админка</h1>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>Основное</h2>

          <input
            className={styles.input}
            placeholder="Название"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <input
            className={styles.input}
            placeholder="Оригинальное название"
            value={form.interName}
            onChange={(e) => handleChange("interName", e.target.value)}
          />

          <input
            className={styles.input}
            placeholder="Постер (URL)"
            value={form.image}
            onChange={(e) => handleChange("image", e.target.value)}
          />

          <input
            className={styles.input}
            placeholder="Видео (YouTube или mp4)"
            value={form.video}
            onChange={(e) => handleChange("video", e.target.value)}
          />

          <textarea
            className={styles.textarea}
            placeholder="Описание"
            value={form.desc}
            onChange={(e) => handleChange("desc", e.target.value)}
          />
        </div>

        <div className={styles.card}>
          <h2>Мета</h2>

          <select
            className={styles.input}
            value={form.year}
            onChange={(e) => handleChange("year", e.target.value)}
          >
            <option value="">Год</option>
            {Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option value={y} key={y}>
                  {y}
                </option>
              );
            })}
          </select>

          <select
            className={styles.input}
            value={form.age}
            onChange={(e) => handleChange("age", e.target.value)}
          >
            {["0+", "6+", "12+", "16+", "18+", "21+"].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <input
            className={styles.input}
            placeholder="Премьера"
            value={form.premiere}
            onChange={(e) => handleChange("premiere", e.target.value)}
          />
        </div>

        <div className={styles.card}>
          <h2>Команда</h2>

          <input
            className={styles.input}
            placeholder="Режиссёр"
            value={form.director}
            onChange={(e) => handleChange("director", e.target.value)}
          />

          <input
            className={styles.input}
            placeholder="Актёры (через запятую)"
            value={form.actors}
            onChange={(e) => handleChange("actors", e.target.value)}
          />

          <input
            className={styles.input}
            placeholder="Сценаристы"
            value={form.writers}
            onChange={(e) => handleChange("writers", e.target.value)}
          />
        </div>

        <div className={styles.card}>
          <h2>Дополнительно</h2>

          <CountrySelect
            value={form.country ? form.country.split(",") : []}
            onChange={(val) => handleChange("country", val.join(","))}
          />

          <GenreSelect
            value={form.genre}
            onChange={(val) => handleChange("genre", val)}
          />

          <select
            className={styles.input}
            value={form.audio}
            onChange={(e) => handleChange("audio", e.target.value)}
          >
            <option value="Русский">Русский</option>
            <option value="Английский">Английский</option>
          </select>

          <select
            className={styles.input}
            value={form.videoQuality}
            onChange={(e) => handleChange("videoQuality", e.target.value)}
          >
            <option value="HD">HD</option>
            <option value="Full HD">Full HD</option>
            <option value="4K">4K</option>
          </select>
        </div>
      </div>

      <button className={styles.submit} onClick={handleSubmit}>
        ➕ Добавить фильм
      </button>
    </div>
  );
}
