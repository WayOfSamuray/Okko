"use client";

import { useState, useRef, useEffect } from "react";
import { GENRES } from "../../../lib/genres";
import styles from "./GenreSelect.module.css";

type Genre = {
  name: string;
  slug: string;
};

type Props = {
  value: Genre[];
  onChange: (val: Genre[]) => void;
};

export default function GenreSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = (genre: Genre) => {
    const exists = value.find((g) => g.slug === genre.slug);

    if (exists) {
      onChange(value.filter((g) => g.slug !== genre.slug));
    } else {
      onChange([...value, genre]);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.input} onClick={() => setOpen(!open)}>
        {value.length ? value.map((g) => g.name).join(", ") : "Выберите жанры"}
      </div>

      {open && (
        <div className={styles.dropdown}>
          {GENRES.map((g) => {
            const checked = value.some((v) => v.slug === g.slug);

            return (
              <label key={g.slug} className={styles.option}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(g)}
                />
                {g.name}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
