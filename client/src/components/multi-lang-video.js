// - Add video.js en video
// - Add de audio
// - Add en srt subtitles
// - Add de srt subtitles

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoJSPlayer = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      playerRef.current = videojs(videoElement, options, () => {
        console.log('player is ready');
        onReady && onReady(playerRef.current);
      });

      playerRef.current.on("volumechanged", () => {
        console.log("Volume changed to", videoElement.volume);
      });

      playerRef.current.on("ready", () => {
        console.log("Player ready. Volume:", videoElement.volume);
      });

      playerRef.current.on("play", () => {
        console.log("Video playing. Volume:", videoElement.volume);
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onReady]);

  return (
    <div data-vjs-player>
      <video 
        ref={videoRef}
        className="video-js vjs-big-play-centered"
      />
    </div>
  );
};

export default VideoJSPlayer;
