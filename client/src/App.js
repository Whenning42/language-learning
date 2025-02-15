import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import 'video.js/dist/video-js.css';
import 'videojs-hotkeys';
import VideoJSPlayer from "./components/multi-lang-video";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

console.log("Using backend url:", backendUrl);

function App() {
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: `${backendUrl}/videos/spongebob_s01e01_en.mp4`,
      type: 'video/mp4'
    }],
    controlBar: {
      // Note: To show controlBar elements we have to update the css on the controlbar
      // elements to make them visible. Ref: https://github.com/videojs/video.js/issues/5751.
      currentTimeDisplay: true,
      remainingTimeDisplay: true,
    },
    disablePictureInPicture: true,
  };

  return (
    <div>
      <h2>Willkommen zum Sprachgeist</h2>
      <VideoJSPlayer options={videoJsOptions}/>
    </div>
  );
}

export default App;
