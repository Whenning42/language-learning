import React, { useContext, useState } from "react"
import "./login-screen.css";
import {useNavigate} from "react-router-dom"

import AppContext from "../app-context/app-context";

function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function LoginScreen () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const {appState, setAppState} = useContext(AppContext);
  const navigate = useNavigate();

  function mock_login() {
    console.log("Logging in as:", username.toLowerCase());

    // TODO: Authenticate the user
    setAppState({
      ...appState,
      username: username.toLowerCase(),
      user_id: hashCode(username.toLowerCase())
    });

    navigate("/home");
  }

  return (
    <div className="login-screen">
      <div className="login-spacer"/>
      <div className="login-panel">
        <div className="login-spacer"/>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={mock_login}>Login</button>
        <a href="/register">Register</a>
        <div className="login-spacer"/>
      </div>
      <div className="login-spacer"/>
    </div>
  )
}

export default LoginScreen;
