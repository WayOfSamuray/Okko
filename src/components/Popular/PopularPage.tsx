import style from "./PopularPage.module.css";

const mockPopular = [
  {
    id: 1,
    title: "Dune: Part Two",
    year: 2024,
    type: "movie",
    tag: "Фантастика / Блокбастер",
    description: "Продолжение истории Пола Атрейдеса и битвы за Арракис.",
  },
  {
    id: 2,
    title: "The Last of Us",
    year: 2023,
    type: "series",
    tag: "Драма / Постапокалипсис",
    description: "Путешествие Джоэла и Элли в мире, разрушенном пандемией.",
  },
  {
    id: 3,
    title: "Oppenheimer",
    year: 2023,
    type: "movie",
    tag: "Биография / Драма",
    description: "История создания атомной бомбы и её последствий.",
  },
  {
    id: 4,
    title: "Wednesday",
    year: 2022,
    type: "series",
    tag: "Мистика / Комедия",
    description: "Уэнсдэй Аддамс и её учеба в Академии Невермор.",
  },
];

const PopularPage = () => {
  return (
    <section className={style.popular}>
      <div className={style.container}>
        <h1 className={style.title}>Популярное</h1>
        <p className={style.subtitle}>
          Здесь собраны примеры популярных фильмов и сериалов. Позже этот
          раздел можно подключить к реальному API с трендами и рейтингами.
        </p>

        <div className={style.grid}>
          {mockPopular.map((item) => (
            <article key={item.id} className={style.card}>
              <div className={style.badge}>
                {item.type === "movie" ? "Фильм" : "Сериал"}
              </div>
              <h2 className={style.cardTitle}>{item.title}</h2>
              <p className={style.cardMeta}>
                <span>{item.year}</span> • <span>{item.tag}</span>
              </p>
              <p className={style.cardText}>{item.description}</p>
            </article>
          ))}
        </div>

        <div className={style.hintBlock}>
          <h2 className={style.hintTitle}>Что можно сделать дальше</h2>
          <p className={style.hintText}>
            Подключить реальный эндпоинт с популярными тайтлами, фильтры по
            жанрам, сортировку по рейтингу, а также кнопки «В избранное»,
            чтобы пользователь мог собирать свою подборку.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PopularPage;
