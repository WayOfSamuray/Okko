"use client";

import { useState } from "react";
import styles from "./MovieDescription.module.css";

type Props = {
  text?: string;
};

const LIMIT = 140;

const MovieDescription = ({ text }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const safeText = text || "";
  const isLong = safeText.length > LIMIT;
  const shortText = isLong ? safeText.slice(0, LIMIT) + "..." : safeText;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Описание</h3>

      <p className={styles.text}>
        {safeText ? (isOpen || !isLong ? safeText : shortText) : "—"}
      </p>

      {isLong && (
        <button
          className={styles.more}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? "Скрыть" : "Подробнее"}
        </button>
      )}
    </div>
  );
};

export default MovieDescription;
