"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    bio: "",
    birthDate: "",
    avatar: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const text = await res.text();

    if (res.ok) {
      alert("Регистрация успешна");
      router.push("/login");
    } else {
      alert(text);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Регистрация</h1>

        <input
          name="name"
          placeholder="Имя"
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          onChange={handleChange}
          className={styles.input}
        />

        <input
          name="birthDate"
          type="date"
          onChange={handleChange}
          className={styles.input}
        />

        <textarea
          name="bio"
          placeholder="О себе"
          onChange={handleChange}
          className={styles.textarea}
        />

        <input
          name="avatar"
          placeholder="Ссылка на аватар (URL)"
          onChange={handleChange}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Создать аккаунт
        </button>
      </form>
    </div>
  );
}
