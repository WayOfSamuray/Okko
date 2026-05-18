"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import styles from "./Login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();

      if (res.ok) {
        const meRes = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (meRes.ok) {
          const userData = await meRes.json();
          setUser(userData);
        }

        router.push("/profile");
      } else {
        alert(text);
      }
    } catch (error) {
      alert("Ошибка сервера");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Вход</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
