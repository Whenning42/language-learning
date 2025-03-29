import React, {useContext} from "react"

import "./menu-bar.css"
import AppContext from "../app-context/app-context"
import { Link } from "react-router-dom"

function MenuBar() {
  // TODO: Get current user's name
  // TODO: Implement /login and /logout routes
  const {appState} = useContext(AppContext);
  const logged_in = (appState.username != null);
  const user_name = appState.username;

  if (logged_in) {
    return (
      <div>
        <div className="full-menu-bar">
          <div className="menu-bar-block">
            Watch N' Learn
            <Link to="/home">Home</Link>
            <Link to="/media">Media</Link>
            <Link to="/note-cards">Notecards</Link>
            <Link to="/placement-quiz">Placement Quiz</Link>
          </div>
          <div className="menu-bar-block">
            {user_name}
            <Link to="/logout">Log out</Link>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div className="full-menu-bar">
          <div className="menu-bar-block">
            Watch N' Learn
          </div>
          <div className="menu-bar-block">
            <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    )
  }

}

export default MenuBar;
