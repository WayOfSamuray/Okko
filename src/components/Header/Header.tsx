import style from "./Header.module.css";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className={style.header}>
      <div className={style.container}>
        <div className={style.logo}>🎬 Okko</div>

        <nav className={style.nav}>
          <NavLink to='/' end className={style.link}>
            Главная
          </NavLink>

          <NavLink to='/popular' className={style.link}>
            Популярное
          </NavLink>

          <NavLink to='/about' className={style.link}>
            О проекте
          </NavLink>

          <NavLink to='/contacts' className={style.link}>
            Контакты
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
