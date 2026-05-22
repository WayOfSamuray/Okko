"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Movie {
  _id: string;
  title: string;
  description?: string;
  posterUrl?: string;
  year?: number;
  genre?: string;
}

export default function EditMoviePage() {
  const { id } = useParams();
  const router = useRouter();

  const [movie, setMovie] = useState<Movie | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch("/api/movies");
        const data = await res.json();

        const found = data.find((m: Movie) => m._id === id);

        if (!found) {
          return;
        }

        setMovie(found);

        setTitle(found.title || "");
        setDescription(found.description || "");
        setPosterUrl(found.posterUrl || "");
        setYear(found.year ? String(found.year) : "");
        setGenre(found.genre || "");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const saveMovie = async () => {
    try {
      setSaving(true);

      await fetch(`/api/movies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          posterUrl,
          year: Number(year),
          genre,
        }),
      });

      router.push(`/movie/${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-white">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Topbar */}
      <div className="border-b border-white/10 bg-[#111111]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <div>
            <p className="text-sm text-zinc-500">
              Admin Panel
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Редактирование фильма
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition hover:bg-white/10"
            >
              Назад
            </button>

            <button
              onClick={saveMovie}
              disabled={saving}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-8 py-8 xl:grid-cols-[360px_1fr]">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Poster */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#151515]">
            <div className="aspect-[2/3] bg-[#1a1a1a]">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-600">
                  Нет постера
                </div>
              )}
            </div>

            <div className="p-5">
              <h2 className="line-clamp-1 text-2xl font-bold">
                {title || "Без названия"}
              </h2>

              <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                <span>{year || "Год"}</span>

                <span>•</span>

                <span>{genre || "Жанр"}</span>
              </div>
            </div>
          </div>

          {/* Publish Panel */}
          <div className="rounded-3xl border border-white/10 bg-[#151515] p-5">
            <h3 className="text-lg font-semibold">
              Публикация
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  Статус
                </span>

                <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
                  Published
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  ID фильма
                </span>

                <span className="max-w-[140px] truncate text-sm">
                  {movie?._id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="space-y-6">
          {/* General */}
          <div className="rounded-3xl border border-white/10 bg-[#151515] p-7">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                Основная информация
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Основные данные о фильме
              </p>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Название фильма
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Введите название"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-5 outline-none transition focus:border-white/30"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-400">
                    Год
                  </label>

                  <input
                    type="number"
                    value={year}
                    onChange={(e) =>
                      setYear(e.target.value)
                    }
                    placeholder="2025"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-5 outline-none transition focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-400">
                    Жанр
                  </label>

                  <input
                    value={genre}
                    onChange={(e) =>
                      setGenre(e.target.value)
                    }
                    placeholder="Action"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-5 outline-none transition focus:border-white/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Poster */}
          <div className="rounded-3xl border border-white/10 bg-[#151515] p-7">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                Постер
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                URL изображения фильма
              </p>
            </div>

            <input
              value={posterUrl}
              onChange={(e) =>
                setPosterUrl(e.target.value)
              }
              placeholder="https://..."
              className="h-14 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-5 outline-none transition focus:border-white/30"
            />
          </div>

          {/* Description */}
          <div className="rounded-3xl border border-white/10 bg-[#151515] p-7">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                Описание
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Полное описание фильма
              </p>
            </div>

            <textarea
              rows={10}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Описание фильма..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-[#0d0d0d] p-5 outline-none transition focus:border-white/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}