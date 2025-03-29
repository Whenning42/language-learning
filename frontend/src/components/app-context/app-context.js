import React, {createContext} from "react"

const AppContext = createContext({
  appState: {
    username: null,
    user_id: null,
    language: null
  },
  setAppState: () => {}
});

export default AppContext;
