import styles from "./MovieExtraInfo.module.css";

type Genre = {
  name: string;
  slug: string;
};

type Movie = {
  _id: string;
  country?: string[];
  genre: Genre[];
  interName?: string;
  premiere?: string;
  year?: number;
  director?: string;
  actors?: string[];
  writers?: string[];
  audio?: string;
  videoQuality?: string;
};

type Props = {
  movie: Movie;
};

const MovieExtraInfo = ({ movie }: Props) => {
  return (
    <div className={styles.extra}>
      <div className={styles.column}>
        <h3>Информация</h3>

        {movie.country?.length ? (
          <div className={styles.item}>
            <span>Страна</span>
            <p>{movie.country.join(", ")}</p>
          </div>
        ) : null}

        <div className={styles.item}>
          <span>Жанр</span>
          <p className={styles.inlineList}>
            {movie.genre?.map((g, i) => (
              <span key={g.slug} className={styles.link}>
                {g.name}
                {i < movie.genre.length - 1 && ", "}
              </span>
            )) || "—"}
          </p>
        </div>

        <div className={styles.item}>
          <span>Оригинальное название</span>
          <p>{movie.interName || "—"}</p>
        </div>

        <div className={styles.item}>
          <span>Премьера в мире</span>
          <p>
            {movie.premiere || "—"} {movie.year || ""}
          </p>
        </div>
      </div>

      <div className={styles.column}>
        <h3>Съёмочная группа</h3>

        <div className={styles.item}>
          <span>Режиссёр</span>
          <p>{movie.director || "—"}</p>
        </div>

        <div className={styles.item}>
          <span>Актёры</span>
          <p>{movie.actors?.join(", ") || "—"}</p>
        </div>

        <div className={styles.item}>
          <span>Сценарист</span>
          <p>{movie.writers?.join(", ") || "—"}</p>
        </div>
      </div>

      <div className={styles.column}>
        <h3>Звук и субтитры</h3>

        <div className={styles.item}>
          <span>Аудио</span>
          <p>{movie.audio || "—"}</p>
        </div>

        <div className={styles.item}>
          <span>Качество</span>
          <p>{movie.videoQuality || "—"}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieExtraInfo;
