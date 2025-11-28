import { useEffect } from "react";
import { useMovieDetails } from "../../helpers/useMovieDetails";
import style from "./MainFile.module.css";
import type { MovieDetailProps } from "../../helpers/useAPI";

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, onBack }) => {
  const { details, status, error, fetchDetails } = useMovieDetails();

  useEffect(() => {
    if (movie?.id) {
      fetchDetails(movie.id);
    }
  }, [movie?.id]); 

  if (!movie) return null;

  const userRating = details?.user_rating;
  const genres = details?.genre_names ?? [];
  const overview = details?.plot_overview;

  return (
    <section className={style.detailSection}>
      <button
        type="button"
        onClick={onBack}
        className={style.backButton}
      >
        Назад
      </button>

      <div className={style.detailLayout}>
        <div className={style.detailPosterWrapper}>
          {movie.image_url ? (
            <img
              src={movie.image_url}
              alt={movie.name}
              loading="lazy"
              className={style.detailPoster}
            />
          ) : (
            <div className={style.posterPlaceholder}>Нет постера</div>
          )}
        </div>

        <div className={style.detailContent}>
          <h2 className={style.detailTitle}>
            {movie.name || details?.title}
          </h2>

          <p className={style.detailMeta}>
            {movie.year && <span>{movie.year}</span>}
          </p>

          {status === "loading" && (
            <p className={style.detailMeta}>Загружаем информацию…</p>
          )}

          {status === "error" && (
            <p className={style.detailError}>{error}</p>
          )}

          {userRating && status === "success" && (
            <p className={style.detailRating}>
              Оценка зрителей: {userRating.toFixed(1)} / 10
            </p>
          )}

          {genres.length > 0 && (
            <p className={style.detailGenres}>
              Жанры: {genres.join(", ")}
            </p>
          )}

          {overview && (
            <p className={style.detailOverview}>
              {overview}
            </p>
          )}

<div className={style.playerBlock}>
  <p className={style.playerHint}>Трейлер</p>

  <iframe
    className={style.player}
    src={`https://www.youtube.com/embed/${details?.trailer?.split("v=")[1]}`}
    title="Trailer"
    allowFullScreen
  />
</div>

        </div>
      </div>
    </section>
  );
};

export default MovieDetail;
