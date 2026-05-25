"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import styles from "./Login.module.css";
import { signIn, useSession } from "next-auth/react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { data: session } = useSession();

  const { setUser } = useAuth();

  useEffect(() => {
    const syncOAuthUser = async () => {
      if (!session?.accessToken) return;

      await fetch("/api/auth/oauth-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        }),
      });

      router.push("/profile");
      router.refresh();
    };

    syncOAuthUser();
  }, [session, router]);

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

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Вход</h1>

        <div className={styles.socials}>
          <button
            type="button"
            onClick={() => signIn("google")}
            className={`${styles.socialBtn} ${styles.google}`}
          >
            <FcGoogle size={22} />
            <span>Продолжить через Google</span>
          </button>

          <button
            type="button"
            onClick={() => signIn("github")}
            className={`${styles.socialBtn} ${styles.github}`}
          >
            <FaGithub size={20} />
            <span>Продолжить через GitHub</span>
          </button>
        </div>

        <div className={styles.divider}>
          <span>или</span>
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