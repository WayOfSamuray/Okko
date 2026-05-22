"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./Edit.module.css";

import {
  ArrowLeft,
  Save,
  Trash2,
  Film,
  Calendar,
  Clapperboard,
  Volume2,
  MonitorPlay,
} from "lucide-react";

type Genre = {
  name: string;
  slug: string;
};

type Movie = {
  _id: string;
  title: string;
  interName?: string;
  image: string;
  video: string;
  genre: Genre[];
  year: number;
  age: string;
  director: string;
  actors: string[];
  desc: string;
  premiere: string;
  country: string[];
  writers: string[];
  audio: string;
  videoQuality: string;
};

const getYoutubeId = (url: string) => {
  if (!url) return "";

  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1];
  }

  if (url.includes("watch?v=")) {
    return url.split("watch?v=")[1].split("&")[0];
  }

  return url;
};

export default function EditMoviePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<Movie>({
    _id: "",
    title: "",
    interName: "",
    image: "",
    video: "",
    genre: [],
    year: new Date().getFullYear(),
    age: "16+",
    director: "",
    actors: [],
    desc: "",
    premiere: "",
    country: [],
    writers: [],
    audio: "",
    videoQuality: "",
  });

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const res = await fetch("/api/movies");
        const data = await res.json();

        const movie = data.find((m: Movie) => m._id === id);

        if (!movie) {
          router.push("/");
          return;
        }

        setForm(movie);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id, router]);

  const updateField = (key: keyof Movie, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateArrayField = (key: keyof Movie, value: string) => {
    updateField(
      key,
      value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    );
  };

  const youtubeId = useMemo(() => {
    return getYoutubeId(form.video);
  }, [form.video]);

  const saveMovie = async () => {
    try {
      setSaving(true);

      await fetch(`/api/movies/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      router.push(`/movie/${id}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteMovie = async () => {
    const ok = confirm("Удалить фильм?");

    if (!ok) return;

    await fetch(`/api/movies/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    router.push("/");
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* TOPBAR */}

      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.topbarLeft}>
            <div className={styles.badge}>Movie Studio</div>

            <h1 className={styles.heading}>
              Редактирование фильма
            </h1>

            <p className={styles.subheading}>
              Управление контентом и метаданными фильма
            </p>
          </div>

          <div className={styles.topbarActions}>
            <button
              onClick={() => router.back()}
              className={styles.backBtn}
            >
              <ArrowLeft size={18} />
            </button>

            <button
              onClick={deleteMovie}
              className={styles.backBtn}
            >
              <Trash2 size={18} />
            </button>

            <button
              onClick={saveMovie}
              disabled={saving}
              className={styles.saveBtn}
            >
              <Save size={18} />

              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </div>

      {/* LAYOUT */}

      <div className={styles.layout}>
        {/* SIDEBAR */}

        <div className={styles.sidebar}>
          {/* POSTER */}

          <div className={styles.card}>
            <div className={styles.posterWrapper}>
              {form.image ? (
                <img
                  src={form.image}
                  alt={form.title}
                  className={styles.poster}
                />
              ) : (
                <div className={styles.posterEmpty}>
                  Нет постера
                </div>
              )}
            </div>

            <div className={styles.posterInfo}>
              <h2 className={styles.posterTitle}>
                {form.title || "Без названия"}
              </h2>

              <div className={styles.posterMeta}>
                <span>{form.year}</span>
                <span>•</span>
                <span>{form.age}</span>
              </div>

              <div className={styles.posterMeta}>
                {form.genre?.map((g) => g.name).join(", ")}
              </div>
            </div>
          </div>

          {/* PANEL */}

          <div className={`${styles.card} ${styles.panel}`}>
            <h3 className={styles.panelTitle}>
              Информация
            </h3>

            <div className={styles.panelContent}>
              <div className={styles.panelRow}>
                <span className={styles.panelLabel}>
                  Статус
                </span>

                <span className={styles.status}>
                  Published
                </span>
              </div>

              <div className={styles.panelRow}>
                <span className={styles.panelLabel}>
                  ID
                </span>

                <span className={styles.panelValue}>
                  {form._id}
                </span>
              </div>
            </div>
          </div>

          {/* TRAILER */}

          <div className={styles.card}>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>
                Трейлер
              </h3>
            </div>

            {youtubeId ? (
              <iframe
                className={styles.trailer}
                src={`https://www.youtube.com/embed/${youtubeId}`}
                allowFullScreen
              />
            ) : (
              <div className={styles.posterEmpty}>
                Нет видео
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}

        <div className={styles.content}>
          {/* BASIC */}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Основная информация
              </h2>

              <p className={styles.sectionText}>
                Основные данные о фильме
              </p>
            </div>

            <div className={styles.formGrid}>
              <Input
                label="Название"
                value={form.title}
                onChange={(v) => updateField("title", v)}
              />

              <Input
                label="Оригинальное название"
                value={form.interName || ""}
                onChange={(v) => updateField("interName", v)}
              />

              <Textarea
                label="Описание"
                value={form.desc}
                onChange={(v) => updateField("desc", v)}
              />
            </div>
          </div>

          {/* MEDIA */}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Медиа
              </h2>

              <p className={styles.sectionText}>
                Постер и трейлер
              </p>
            </div>

            <div className={styles.formGrid}>
              <Input
                label="URL постера"
                value={form.image}
                onChange={(v) => updateField("image", v)}
              />

              <Input
                label="YouTube URL"
                value={form.video}
                onChange={(v) => updateField("video", v)}
              />
            </div>
          </div>

          {/* META */}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Метаданные
              </h2>

              <p className={styles.sectionText}>
                Информация о релизе
              </p>
            </div>

            <div className={styles.row2}>
              <Input
                label="Год"
                type="number"
                value={String(form.year)}
                onChange={(v) => updateField("year", Number(v))}
              />

              <Input
                label="Возраст"
                value={form.age}
                onChange={(v) => updateField("age", v)}
              />

              <Input
                label="Премьера"
                value={form.premiere}
                onChange={(v) => updateField("premiere", v)}
              />

              <Input
                label="Страны"
                value={form.country.join(", ")}
                onChange={(v) => updateArrayField("country", v)}
              />
            </div>

            <div style={{ marginTop: 24 }}>
              <Input
                label="Жанры"
                value={form.genre.map((g) => g.name).join(", ")}
                onChange={(v) =>
                  updateField(
                    "genre",
                    v
                      .split(",")
                      .map((g) => g.trim())
                      .filter(Boolean)
                      .map((g) => ({
                        name: g,
                        slug: g.toLowerCase().replace(/\s+/g, "-"),
                      })),
                  )
                }
              />
            </div>
          </div>

          {/* PRODUCTION */}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Съёмочная группа
              </h2>

              <p className={styles.sectionText}>
                Люди участвующие в проекте
              </p>
            </div>

            <div className={styles.formGrid}>
              <Input
                label="Режиссёр"
                value={form.director}
                onChange={(v) => updateField("director", v)}
              />

              <Input
                label="Актёры"
                value={form.actors.join(", ")}
                onChange={(v) => updateArrayField("actors", v)}
              />

              <Input
                label="Сценаристы"
                value={form.writers.join(", ")}
                onChange={(v) => updateArrayField("writers", v)}
              />
            </div>
          </div>

          {/* TECH */}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Техническая информация
              </h2>

              <p className={styles.sectionText}>
                Аудио и качество
              </p>
            </div>

            <div className={styles.row2}>
              <Input
                label="Аудио"
                value={form.audio}
                onChange={(v) => updateField("audio", v)}
              />

              <Input
                label="Качество"
                value={form.videoQuality}
                onChange={(v) => updateField("videoQuality", v)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
};

const Input = ({
  label,
  value,
  onChange,
  type = "text",
}: InputProps) => {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
      />
    </div>
  );
};

type TextareaProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

const Textarea = ({
  label,
  value,
  onChange,
}: TextareaProps) => {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
      </label>

      <textarea
        rows={10}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.textarea}
      />
    </div>
  );
};