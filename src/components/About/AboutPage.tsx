import style from "./AboutPage.module.css";

const AboutPage = () => {
  return (
    <section className={style.about}>
      <div className={style.container}>
        <h1 className={style.title}>О проекте Okko</h1>
        <p className={style.subtitle}>
         Okko — один из крупнейших российских онлайн-кинотеатров. Здесь смотрят фильмы, сериалы, мультфильмы, ТВ-каналы, спорт и многое другое. Подпиской легко делиться:  в одном аккаунте можно создать пять профилей, взрослых или детских. И у каждого будут свои персональные рекомендации и история просмотров.
        </p>

        <div className={style.grid}>
          <article className={style.card}>
            <h2 className={style.cardTitle}>Зачем это всё</h2>
            <p className={style.cardText}>
              Популярные сериалы от AMEDIATEKA и START, российские фильмы и мировые блокбастеры, артхаус и детский раздел, а также образовательные программы, лекции, онлайн-трансляции концертов и спектаклей. Кроме того, что есть во всех кинотеатрах, в Okko много собственного, эксклюзивного контента: сериалы, документальные расследования, увлекательные шоу.
            </p>
          </article>

          <article className={style.card}>
            <h2 className={style.cardTitle}>Не только кино</h2>
            <p className={style.cardText}>
              <ul className={style.list}>
                <li>футбольные матчи Ла Лиги, Кубка Италии, Кубка Голландии, Лиги наций УЕФА, а также отбор к ЕВРО-2024;</li>
                <li>турниры по смешанным единоборствам Brave CF, MMA Серии и Союза ММА России;</li>
                <li>фигурное катание,</li>
                <li>теннисные матчи Кубка Дэвиса.</li>
                <li>Full HD качество трансляций, профессиональные комментаторы, дополнительные материалы после матчей и простое управление просмотром помогут с комфортом болеть за своих.</li>
              </ul>
            </p>
          </article>

          <article className={style.card}>
            <h2 className={style.cardTitle}>Коротко о важном</h2>
            <p className={style.cardText}>
              <ul className={style.list}>
                <li>Каталог пополняется регулярно</li>
                <li>Детский раздел с фильтрами по возрасту</li>
                <li>Фильмы на языке оригинала с субтитрами</li>
                <li>Просмотр без доступа к интернету</li>
              </ul>
            </p>
          </article>

          <article className={style.card}>
            <h2 className={style.cardTitle}>Идеи на будущее</h2>
            <p className={style.cardText}>
              <ul className={style.list}>
                <li>Избранные фильмы и список «Хочу посмотреть»</li>
                <li>Блок популярных и трендовых тайтлов</li>
                <li>Подборки от проекта Kino OnAir</li>
                <li>Авторизация и сохранение настроек пользователя</li>
              </ul>
            </p>
          </article>
        </div>

        <div className={style.bottomBlock}>
          <h2 className={style.bottomTitle}>Передовые технологии звука и изображения</h2>
          <p className={style.bottomText}>
            Хотите получить от домашнего просмотра те же ощущения, что в кинотеатре? В Okko доступно кино со звуком Dolby Atmos и Dolby Digital Plus, а также целая коллекция фильмов в качестве Ultra HD 4K и даже 8K. Никаких помех — полное погружение в мир кинематографа!
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
