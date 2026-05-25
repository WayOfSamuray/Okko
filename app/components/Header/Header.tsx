"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./Header.module.css";
import MovieSearch from "./MovieSearch";
import { useAuth } from "../../providers/AuthProvider";
import { Search, X } from "lucide-react";

const navItems = [
  { name: "Главная", path: "/" },
  { name: "Каталог", path: "/catalog" },
  { name: "Медиа", path: "/media" },
  { name: "Моё", path: "/my" },
];

const Header = () => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { isAuth, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };
  const router = useRouter();

  const handleAddMovie = () => {
    router.push("/admin");
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.svg"
            alt="Okko-logo"
            width={0}
            height={0}
            className={styles.logoImg}
            style={{ width: "90px", height: "auto" }}
          />
        </Link>

        {!isSearchOpen && (
          <nav className={styles.nav}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`${styles.link} ${isActive ? styles.active : ""}`}
                >
                  {item.name}
                  {isActive && <span className={styles.underline} />}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <div className={styles.right}>
        {!isSearchOpen ? (
          <div className={styles.search} onClick={() => setIsSearchOpen(true)}>
            <Search size={20} />
          </div>
        ) : (
          <>
            <MovieSearch onClose={() => setIsSearchOpen(false)} />

            <span
              className={styles.close}
              onClick={() => setIsSearchOpen(false)}
            >
              <X size={22} />
            </span>
          </>
        )}

        {!isSearchOpen && (
          <>
            {isAuth && (
              <button onClick={handleAddMovie} className={styles.subscribe}>
                Добавить фильм
              </button>
            )}

            <button className={styles.promo}>
              <span className={styles.gift}>🎁</span>
              Ввести промокод
            </button>

            {!isAuth ? (
              <div className={styles.authButtons}>
                <Link href="/login" className={styles.login}>
                  Войти
                </Link>
                <Link href="/register" className={styles.register}>
                  Регистрация
                </Link>
              </div>
            ) : (
              <div className={styles.avatarContainer}>
                <Link href="/profile">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarLetter}>
                      {user?.email?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </Link>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Выйти
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
