"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditMoviePage() {
  const { id } = useParams();
  const router = useRouter();

  const [movie, setMovie] = useState<any>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch(`/api/movies`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((m: any) => m._id === id);
        setMovie(found);
        setTitle(found?.title || "");
      });
  }, [id]);

  const save = async () => {
    await fetch(`/api/movies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    router.push(`/movie/${id}`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Редактировать фильм</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название"
      />

      <button onClick={save}>Сохранить</button>
    </div>
  );
}
