import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import 'video.js/dist/video-js.css';
import 'videojs-hotkeys';
import VideoJSPlayer from "./components/multi-lang-video";
import NoteCardEditor from "./components/note-card-editor";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

console.log("Using backend url:", backendUrl);

function App() {
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: false,
    sources: [{
      src: `${backendUrl}/videos/spongebob_s01e02_de.mp4`,
      type: 'video/mp4'
    }],
    controlBar: {
      // Note: To show controlBar elements we have to update the css on the controlbar
      // elements to make them visible. Ref: https://github.com/videojs/video.js/issues/5751.
      currentTimeDisplay: true,
      remainingTimeDisplay: true,
    },
    disablePictureInPicture: true,
    plugins: {
      hotkeys: {
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false,
      },
    },
    tracks: [
      {
        kind: "subtitles",
        src: `${backendUrl}/videos/spongebob_s01e01_en.vtt`,
        srcLang: "en",
        label: "English",
      },
      {
        kind: "subtitles",
        src: `${backendUrl}/videos/spongebob_s01e01_de_from_transcript.vtt`,
        srcLang: "de",
        label: "German",
        default: false,
      },
    ],
  };

  return (
    <div style={{paddingLeft: "1rem", paddingRight: "1rem"}}>
      <h2>Willkommen zum Sprachgeist</h2>
      <div style={{display: "flex"}}>
        <VideoJSPlayer options={videoJsOptions}/>
        <NoteCardEditor/>
      </div>
    </div>
  );
}

export default App;
