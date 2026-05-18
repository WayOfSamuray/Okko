"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../MoviePage.module.css";
import MovieMeta from "./MovieMeta";
import MovieActions from "./MovieActions";
import { Volume2, VolumeX } from "lucide-react";

const getYoutubeId = (url: string) => {
  if (!url) return "";
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1];
  if (url.includes("watch?v=")) return url.split("watch?v=")[1].split("&")[0];
  return url;
};

const MovieHero = ({ movie, isOwner }: any) => {
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const youtubeId = getYoutubeId(movie.video);

  useEffect(() => {
    if (!movie) return;

    fetch(`/api/movies/${movie._id}/view`, {
      method: "POST",
    });
  }, [movie]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
      setIsPlaying(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [movie]);

  useEffect(() => {
    if (!showVideo || !iframeRef.current) return;

    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: "mute",
        args: [],
      }),
      "*",
    );

    setIsMuted(true);
  }, [showVideo]);

  const togglePlayback = () => {
    if (!iframeRef.current) return;

    const command = isPlaying ? "pauseVideo" : "playVideo";

    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: command,
        args: [],
      }),
      "*",
    );

    setIsPlaying((p) => !p);
  };

  const toggleMute = () => {
    if (!iframeRef.current) return;

    const command = isMuted ? "unMute" : "mute";

    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: command,
        args: [],
      }),
      "*",
    );

    setIsMuted((m) => !m);
  };

  return (
    <div className={`${styles.hero} ${isPlaying ? styles.playing : ""}`}>
      {showVideo && (
        <div className={styles.heroVideoWrapper}>
          <iframe
            ref={iframeRef}
            className={styles.bgVideo}
            src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&controls=0&rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1`}
            allow="autoplay; encrypted-media"
          />
        </div>
      )}

      {!showVideo && (
        <div
          className={styles.bg}
          style={{ backgroundImage: `url(${movie.image})` }}
        />
      )}

      <div className={styles.overlay} />

      <div
        className={`${styles.content} ${isPlaying ? styles.hideContent : ""}`}
      >
        <MovieMeta movie={movie} />
        <MovieActions movie={movie} isOwner={isOwner} />
      </div>

      <div className={styles.playButtonWrapper}>
        <button
          className={styles.playButton}
          onClick={(e) => {
            e.stopPropagation();
            togglePlayback();
          }}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
      </div>
      <div className={styles.soundButtonWrapper}>
        <button
          className={styles.soundButton}
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </div>
  );
};

export default MovieHero;
