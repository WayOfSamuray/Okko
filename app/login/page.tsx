"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "../providers/AuthProvider";

import styles from "./Login.module.css";

import { signIn } from "next-auth/react";

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

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        const text = await res.text();

        alert(text);

        return;
      }

      const meRes = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (meRes.ok) {
        const userData = await meRes.json();

        setUser(userData);
      }

      router.push("/profile");

      router.refresh();
    } catch (e) {
      console.error(e);

      alert("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    await signIn("google", {
      callbackUrl: "/api/auth/oauth-success",
    });
  };

  const loginGithub = async () => {
    await signIn("github", {
      callbackUrl: "/api/auth/oauth-success",
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Вход</h1>

        <div className={styles.socials}>
          <button
            type="button"
            onClick={loginGoogle}
            className={styles.socialBtn}
          >
            Google
          </button>

          <button
            type="button"
            onClick={loginGithub}
            className={styles.socialBtn}
          >
            GitHub
          </button>
        </div>

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

        <button
          type="submit"
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
}