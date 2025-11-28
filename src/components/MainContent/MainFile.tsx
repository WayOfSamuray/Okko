import {
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import style from "./MainFile.module.css";
import { useApi } from "../../helpers/useAPI";
import type { Movie } from "../../helpers/useAPI";
import MovieDetail from "./MovieDetail";
import SearchBar from "../Search/SearchBar";

const MainFile = () => {
  const [query, setQuery] = useState("spider");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { result, status, error, fetchMovies } = useApi();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSelectedMovie(null);
    fetchMovies(query);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    fetchMovies(query);
  }, []);

  const handleCardClick = (item: Movie) => {
    setSelectedMovie(item);
  };

  const handleBackClick = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={style.page}>
      <header className={style.header}>
        <h1 className={style.title}>Watch Okko</h1>
        <p className={style.subtitle}>
          Найди фильм или сериал и посмотри постер, год и трейлер Пика Пика.
        </p>

        {!selectedMovie && (
          <SearchBar
          query={query}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          />
        )}
      </header>

      {selectedMovie ? (
        <MovieDetail movie={selectedMovie} onBack={handleBackClick} />
      ) : (
        <>
          {status === "loading" && (
            <div className={style.centerText}>Загружаем...</div>
          )}

          {status === "error" && (
            <div className={`${style.centerText} ${style.errorText}`}>
              {error}
            </div>
          )}

          {status === "success" && result.length === 0 && (
            <div className={style.centerText}>Ничего не найдено</div>
          )}

          <main className={style.grid}>
            {result.map((item) => (
              <article
                key={item.id}
                className={style.card}
                onClick={() => handleCardClick(item)}
              >
                <div className={style.posterWrapper}>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      loading="lazy"
                      className={style.poster}
                    />
                  ) : (
                    <div className={style.posterPlaceholder}>
                      Нет постера
                    </div>
                  )}
                </div>

                <div className={style.cardBody}>
                  <h2 className={style.cardTitle}>{item.name}</h2>

                  <p className={style.cardMeta}>
                    {item.year && <span>{item.year}</span>}
                    {!!item.genre_names?.length && (
                      <span> • {item.genre_names.join(", ")}</span>
                    )}
                  </p>

                  <p className={style.cardTag}>
                    {item.result_type === "title"
                      ? "Title"
                      : item.result_type || "-"}
                  </p>
                </div>
              </article>
            ))}
          </main>
        </>
      )}
    </div>
  );
};

export default MainFile;
