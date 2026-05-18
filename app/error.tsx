"use client";

import styles from "./error.module.css";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className={styles.container}>
      <div className={styles.glow} />

      <div className={styles.card}>
        <div className={styles.code}>500</div>

        <h1 className={styles.title}>Что-то пошло не так</h1>

        <p className={styles.text}>
          Во время загрузки страницы произошла ошибка.
        </p>

        <button className={styles.button} onClick={() => reset()}>
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
