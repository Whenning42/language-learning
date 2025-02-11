import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

console.log("Using backend url:", backendUrl);

function App() {
  // const videoJsOptions = {
  //   autoplay: false,
  //   controls: true,
  //   responsive: true,
  //   fluid: true,
  //   sources: [{
  //     src: `${backendUrl}/videos/spongebob_s01e01_en.mp4`,
  //     type: 'video/mp4'
  //   }]
  // };

  // return (
  //   <div>
  //     <h2>Willkommen zum Sprachgeist</h2>
  //     <VideoJSPlayer options={videoJsOptions}/>
  //   </div>
  // );

  const videoSrc = `${backendUrl}/videos/spongebob_s01e01_en.mp4`
  const captionSrc = `${backendUrl}/videos/spongebob_s01e01_en.vtt`

  return (
    <div>
      <video
        className="video-js"
        controls
        preload="auto"
        width="640"
        height="264"
        data-setup='{}'>
        <source src={videoSrc} type="video/mp4"/>
        <track kind="captions" src={captionSrc} srcLang="en" label="English" default/>
      </video>
    </div>
  );
}

export default App;
