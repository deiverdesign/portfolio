"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./AboutPageProcessV3.module.css";

interface AboutProcessVideoProps {
  readonly src: string;
  readonly poster: string;
  readonly thumbnail: string;
}

/**
 * A peça começa só quando uma parte substancial dela entra na viewport. Um
 * clique alterna play/pause; depois de uma pausa explícita, o observer não
 * volta a iniciá-la sozinho.
 */
export function AboutProcessVideo({ src, poster, thumbnail }: AboutProcessVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const [hasStartedOnCompact, setHasStartedOnCompact] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          video.pause();
          return;
        }

        if (!userPausedRef.current) {
          void video.play().catch(() => undefined);
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPausedRef.current = false;
      void video.play().catch(() => undefined);
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  };

  const startFromThumbnail = () => {
    setHasStartedOnCompact(true);
    userPausedRef.current = false;
    window.requestAnimationFrame(() => {
      void videoRef.current?.play().catch(() => undefined);
    });
  };

  return (
    <div className={styles.videoFrame} data-compact-started={hasStartedOnCompact || undefined}>
      <button
        type="button"
        className={styles.thumbnailControl}
        onClick={startFromThumbnail}
        aria-label="Play showreel"
      >
        <img src={thumbnail} alt="Showreel preview" />
      </button>
      <button
        type="button"
        className={styles.videoControl}
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pause showreel" : "Play showreel"}
      >
        <video
          ref={videoRef}
          className={styles.video}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <span className={styles.videoStatus} aria-hidden="true">
          {isPlaying ? "Pause" : "Play"}
        </span>
      </button>
    </div>
  );
}
