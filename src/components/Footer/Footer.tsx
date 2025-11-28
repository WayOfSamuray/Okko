import style from "./Footer.module.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={style.footer}>
      <div className={style.container}>
        <div className={style.brand}>
          <div className={style.logo}>🎬 Okko</div>
          <p className={style.text}>
            Поиск фильмов и сериалов по всему миру. Постеры, годы, типы — всё в одном месте.
          </p>
        </div>

        <div className={style.column}>
          <h3 className={style.title}>Навигация</h3>
          <a className={style.link} href="/">Главная</a>
          <a className={style.link} href="/about">О проекте</a>
          <a className={style.link} href="/contacts">Контакты</a>
          <a className={style.link} href="/faq">FAQ</a>
        </div>

        <div className={style.column}>
          <h3 className={style.title}>Мы в сети</h3>
          <a className={style.link} href="https://vk.com/okkomovies" target="_blank">VK</a>
          <a className={style.link} href="https://t.me/okkomovies" target="_blank">Telegram</a>
          <a className={style.link} href="https://www.youtube.com/channel/UC7a8hHrl1lrK92Ab91sOXdA" target="_blank">YouTube</a>
        </div>
      </div>

      <div className={style.bottom}>
        <span className={style.copy}>© {year} Okko</span>
        <span className={style.muted}>Проект создан для обучения React.</span>
      </div>
    </footer>
  );
};

export default Footer;
