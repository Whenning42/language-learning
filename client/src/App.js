import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import 'video.js/dist/video-js.css';
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
    }]
  };

  return (
    <div>
      <h2>Willkommen zum Sprachgeist</h2>
      <VideoJSPlayer options={videoJsOptions}/>
    </div>
  );
}

export default App;
