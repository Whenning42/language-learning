import React, {StrictMode, useEffect, useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Layout from "./components/layout";
import HomePage from "./components/home-page/home-page";
import MediaPage from "./components/media-view/media-page";
import StudyNoteCards from "./components/study-note-cards/study-note-cards";
import PlacementQuiz from "./components/placement-quiz/placement-quiz";
import LoginScreen from "./components/account/login-screen";
import LogoutScreen from "./components/account/logout-screen";
import AppContext from "./components/app-context/app-context"

const backendUrl = process.env.REACT_APP_BACKEND_URL;

console.log("Using backend url:", backendUrl);

function App() {
  const [appState, setAppState] = useState(() => {
    try {
      return JSON.parse(document.cookie);
    } catch (e) {
      return {}
    }
  });
  const value = {appState, setAppState};

  // Cookie setter.
  useEffect(() => {
    document.cookie = JSON.stringify(appState);
  }, [appState])

  return (
    <StrictMode>
      <AppContext.Provider value={value}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route path="/home" element={<HomePage/>}/>
              <Route path="/media" element={<MediaPage/>}/>
              <Route path="/note-cards" element={<StudyNoteCards/>}/>
              <Route path="/placement-quiz" element={<PlacementQuiz/>}/>
              <Route path="/login" element={<LoginScreen/>}/>
              <Route path="/logout" element={<LogoutScreen/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </StrictMode>
  );
}

export default App;
