"use client";

import { useEffect, useState } from "react";
import styles from "./Comments.module.css";

type Comment = {
  _id: string;
  text: string;
  userName?: string;
  userAvatar?: string;
  parentId?: string;
  likes?: string[];
  dislikes?: string[];
};

export default function Comments({ movieId }: { movieId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [text, setText] = useState("");

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/comments?movieId=${movieId}`);

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setComments(data);
    } catch (e) {
      console.error("LOAD COMMENTS ERROR:", e);
    }
  };

  useEffect(() => {
    loadComments();
  }, [movieId]);

  const addComment = async () => {
    if (!text.trim()) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          movieId,
          parentId: replyTo,
        }),
      });

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

      setText("");
      setReplyTo(null);
      loadComments();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteComment = async (id: string) => {
    try {
      const res = await fetch("/api/comments/delete", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: id }),
      });

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

      loadComments();
    } catch (e) {
      console.error(e);
    }
  };

  const react = async (id: string, type: "like" | "dislike") => {
    try {
      const res = await fetch("/api/comments/react", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: id, type }),
      });

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

      loadComments();
    } catch (e) {
      console.error(e);
    }
  };

  const render = (parentId?: string) =>
    comments
      .filter((c) => (parentId ? c.parentId === parentId : !c.parentId))
      .map((c) => (
        <div key={c._id} className={styles.comment}>
          <div className={styles.header}>
            {c.userAvatar ? (
              <img src={c.userAvatar} className={styles.avatar} />
            ) : (
              <div className={styles.avatarFallback}>
                {c.userName?.[0] || "?"}
              </div>
            )}
            <span className={styles.name}>{c.userName}</span>
          </div>

          <p className={styles.text}>{c.text}</p>

          <div className={styles.actions}>
            <button onClick={() => react(c._id, "like")}>
              👍 {c.likes?.length || 0}
            </button>

            <button onClick={() => react(c._id, "dislike")}>
              👎 {c.dislikes?.length || 0}
            </button>

            <button onClick={() => setReplyTo(c._id)}>Ответить</button>

            <button onClick={() => deleteComment(c._id)}>🗑</button>
          </div>

          <div className={styles.reply}>{render(c._id)}</div>
        </div>
      ));

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Комментарии</h3>

      <div className={styles.form}>
        <input
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={replyTo ? "Ответить..." : "Написать комментарий..."}
        />

        <button className={styles.button} onClick={addComment}>
          Отправить
        </button>
      </div>

      <div className={styles.list}>{render()}</div>
    </div>
  );
}
