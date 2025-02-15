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
        videoElement.volume = 0.5;
        onReady && onReady(playerRef.current);

        console.log("Control bar options:", options.controlBar, playerRef.current.controlBar);
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
