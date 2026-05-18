"use client";

import { useParams } from "next/navigation";
import styles from "../MoviePage.module.css";
import { useMovie } from "../hooks/useMovie";
import { useOwner } from "../hooks/useOwner";
import MovieHero from "./MovieHero";
import MovieDescription from "../../MovieDescription/MovieDescription";
import Rating from "../../Rating/Rating";
import SimilarMovies from "../../../components/SimilarMovie/SimilarMovie";
import MovieExtraInfo from "../../../components/MovieExtraInfo/MovieExtraInfo";
import Comments from "../../../components/Comments/Comments";

const MoviePage = () => {
  const params = useParams();
  const { movie, loading } = useMovie(params.id as string);
  const { isOwner } = useOwner(movie);

  if (!movie) return <div>Фильм не найден</div>;

  return (
    <div className={styles.page}>
      <MovieHero movie={movie} isOwner={isOwner} />

      <div className={styles.bottom}>
        <MovieDescription text={movie.desc} />
        <Rating movieId={movie._id} />
      </div>

      <SimilarMovies currentId={movie._id} genres={movie.genre} />

      <div className={styles.container}>
        <MovieExtraInfo movie={movie} />
      </div>

      <Comments movieId={movie._id} />
    </div>
  );
};

export default MoviePage;
