import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loading}>
      <div className={styles.glow} />
      <div className={styles.loader} />
    </div>
  );
}
