import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.glow} />

      <div className={styles.card}>
        <div className={styles.code}>404</div>

        <h1 className={styles.title}>Страница не найдена</h1>

        <p className={styles.text}>
          Возможно, страница была удалена или ссылка неверна.
        </p>

        <Link href="/" className={styles.button}>
          На главную
        </Link>
      </div>
    </div>
  );
}
