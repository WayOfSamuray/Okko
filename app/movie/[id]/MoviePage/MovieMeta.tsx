"use client";

import Link from "next/link";
import styles from "../MoviePage.module.css";
import { useEffect, useState } from "react";
import { pusherClient } from "../../../../lib/pusher-client";

const MovieMeta = ({ movie }: any) => {
  const [liveRating, setLiveRating] = useState(movie.averageRating || 0);

  // useEffect(() => {
  //   const channel = pusherClient.subscribe("movies");

  //   channel.bind("rating-updated", (data: any) => {
  //     if (data.movieId === movie._id) {
  //       setLiveRating(data.averageRating);
  //     }
  //   });

  //   return () => {
  //     channel.unbind_all();
  //     pusherClient.unsubscribe("movies");
  //   };
  // }, [movie._id]);

  useEffect(() => {
    if(!pusherClient) return;

    const channel = pusherClient.subscribe('movies')

    channel.bind('rating-updated', (data: any) => {
      if(data.movieId === movie._id) {
        setLiveRating(data.averageRating)
      }
    })
    return () => {
      channel.unbind_all();
      pusherClient?.unsubscribe('movies');
    }

  }, [movie._id])

  return (
    <>
      <h1 className={styles.title}>{movie.title.toUpperCase()}</h1>

      <div className={styles.info}>
        <span className={styles.rating}>
          {liveRating ? liveRating.toFixed(1) : "-"}
        </span>

        <span>{movie.year}</span>

        <span className={styles.genres}>
          {movie.genre.map((g: any, i: number) => (
            <span key={g.slug}>
              <Link href={`/genres/${g.slug}`} className={styles.genreLink}>
                {g.name}
              </Link>

              {i < movie.genre.length - 1 && ", "}
            </span>
          ))}
        </span>

        <span>{movie.age}</span>
      </div>

      <div className={styles.meta}>
        <p>Режиссёр: {movie.director}</p>
        <p>Актёры: {movie.actors.slice(0, 3).join(", ")}</p>

        <p className={styles.desc}>{movie.desc}</p>
      </div>
    </>
  );
};

export default MovieMeta;
