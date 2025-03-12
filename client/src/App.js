import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Layout from "./components/layout";
import HomePage from "./components/home-page/home-page";
import MediaPage from "./components/media-view/media-page";
import StudyNoteCards from "./components/study-note-cards/study-note-cards";
import PlacementQuiz from "./components/placement-quiz/placement-quiz"

const backendUrl = process.env.REACT_APP_BACKEND_URL;

console.log("Using backend url:", backendUrl);

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/media" element={<MediaPage/>}/>
            <Route path="/note-cards" element={<StudyNoteCards/>}/>
            <Route path="/placement-quiz" element={<PlacementQuiz/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
