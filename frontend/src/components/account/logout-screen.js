import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import AppContext from '../app-context/app-context';

function LogoutScreen() {
  const {appState, setAppState} = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
      navigate('/home');
      setAppState({
        ...appState,
        username: null,
        user_id: null
      })
  }, []);

  return null;
};

export default LogoutScreen;
