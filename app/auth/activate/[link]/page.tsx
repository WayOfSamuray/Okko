"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ActivatePage() {
  const { link } = useParams<{ link: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!link) return;

    const activate = async () => {
      try {
        const res = await fetch(`/api/auth/activate/${link}`, {
          method: "GET",
        });

        if (res.redirected) {
          setStatus("success");
          setMessage("Аккаунт успешно активирован!");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          const text = await res.text();
          setStatus("error");
          setMessage(text || "Неверная или просроченная ссылка");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Произошла ошибка при активации");
      }
    };

    activate();
  }, [link, router]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Активация аккаунта</h1>

      {status === "loading" && <p>Активируем ваш аккаунт...</p>}

      {status === "success" && (
        <>
          <p style={{ color: "green", fontSize: "18px" }}>{message}</p>
          <p>Сейчас вас перенаправит на страницу входа...</p>
        </>
      )}

      {status === "error" && (
        <p style={{ color: "red", fontSize: "18px" }}>{message}</p>
      )}
    </div>
  );
}
