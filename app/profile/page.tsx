"use client";

import { useEffect, useState } from "react";
import styles from "./Profile.module.css";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const loadUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();

      setUser(data);

      setName(data.name || "");
      setBio(data.bio || "");
      setAvatar(data.avatar || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const saveProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("bio", bio);

      if (file) {
        formData.append("avatar", file);
      }

      const res = await fetch("/api/user/update", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        console.error("Ошибка обновления");
        return;
      }

      setEditMode(false);
      setFile(null);

      loadUser();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loader} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loadingWrapper}>
        <p>Пользователь не авторизован</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.userCard}>
        {avatar ? (
          <img src={avatar} className={styles.avatar} />
        ) : (
          <div className={styles.avatarFallback}>
            {name?.[0] || "?"}
          </div>
        )}

        <div>
          <h2>{name || "Без имени"}</h2>
          <p className={styles.email}>{user.email}</p>
        </div>
      </div>

      <div className={styles.card}>
        <h3>Профиль</h3>

        {editMode ? (
          <>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Имя"
            />

            <textarea
              className={styles.textarea}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="О себе"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selected = e.target.files?.[0] || null;

                setFile(selected);

                if (selected) {
                  setAvatar(URL.createObjectURL(selected));
                }
              }}
            />

            <button
              className={styles.saveBtn}
              onClick={saveProfile}
            >
              Сохранить
            </button>
          </>
        ) : (
          <>
            <p>{bio || "Нет описания"}</p>

            <button
              className={styles.editBtn}
              onClick={() => setEditMode(true)}
            >
              Редактировать
            </button>
          </>
        )}
      </div>
    </div>
  );
}