"use client";

import { useState } from "react";
import { Bookmark, Eye, Ban, Share2 } from "lucide-react";
import styles from "../MoviePage.module.css";
import { useFavorite } from "../hooks/useFavorite";
import { useShare } from "../hooks/useShare";
import SharePopup from "./MovieShare.tsx/MovieShare";
import AdminActions from "./MovieAdminActions";

const MovieActions = ({ movie, isOwner }: any) => {
  const { isFavorite, toggleFavorite } = useFavorite(movie);
  const { getShareLinks } = useShare();

  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className={styles.actions}>
      <button className={styles.iconBtn}>
        <Bookmark size={20} />
      </button>

      <button
        onClick={toggleFavorite}
        className={`${styles.iconBtn} ${isFavorite ? styles.active : ""}`}
      >
        {isFavorite ? <Bookmark size={20} /> : <Eye size={20} />}
      </button>

      <button className={styles.iconBtn}>
        <Ban size={20} />
      </button>

      {isOwner && <AdminActions movieId={movie._id} />}

      <div className={styles.shareWrapper}>
        <button
          className={styles.iconBtn}
          onClick={() => setShareOpen((p) => !p)}
        >
          <Share2 size={20} />
        </button>

        {shareOpen && <SharePopup links={getShareLinks()} />}
      </div>
    </div>
  );
};

export default MovieActions;
