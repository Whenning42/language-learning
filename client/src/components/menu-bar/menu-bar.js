import React from "react"

import "./menu-bar.css"

function MenuBar() {
  return (
    <div>
      <div style={{display: "inline-block"}}>
        <div className="menu-bar">Watch N' Learn</div>
        <div className="menu-bar"><a href="/home">Home</a></div>
        <div className="menu-bar"><a href="/media">Media</a></div>
        <div className="menu-bar"><a href="/note-cards">Notecards</a></div>
        <div className="menu-bar"><a href="/placement-quiz">Placement Quiz</a></div>
      </div>
    </div>
  )
}

export default MenuBar;
