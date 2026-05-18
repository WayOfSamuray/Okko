"use client";

import { FaTelegramPlane } from "react-icons/fa";
import styles from './MovieShare.module.css'

import {
  FaTelegram,
  FaVk,
  FaOdnoklassniki,
  FaXTwitter,
  FaFacebookF,
  FaLink,
} from "react-icons/fa6";

const icons: any = {
  Телеграм: <FaTelegram />,
  ВКонтакте: <FaVk />,
  ОК: <FaOdnoklassniki />,
  Х: <FaXTwitter />,
  Фейсбук: <FaFacebookF />,
};

const SharePopup = ({ links }: any) => {
  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className={styles.sharePopup}>
      {Object.entries(links).map(([key, link]) => (
        <button
          key={key}
          className={styles.shareItem}
          onClick={() => window.open(link as string, "_blank")}
        >
          <div className={styles.shareIcon}>{icons[key]}</div>

          <span className={styles.shareLabel}>{key}</span>
        </button>
      ))}

      <button className={styles.shareItem} onClick={copyLink}>
        <div className={styles.shareIcon}>
          <FaLink />
        </div>

        <span className={styles.shareLabel}>Скопировать</span>
      </button>
    </div>
  );
};

export default SharePopup;