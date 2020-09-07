import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import {useRouts} from "./components/Routes";
import {useAuth} from "./hooks/Auth.hook";
import {AuthContext} from "./components/context/AuthContext";
import './components/appearence/css/index.css';
import Loading from "./components/Loading";

function App() {
    const {token, userID, username, userType, name, surname, login, logout, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRouts(isAuthenticated, userType, username)

    if (!ready) {
        return (
            <Loading/>
        )
    }

  return (
      <AuthContext.Provider value = { { token, userID, username, userType, name, surname, login, logout, isAuthenticated } }>
          <Router>
            <div>
                { routes }
            </div>
          </Router>
      </AuthContext.Provider>
  );
}

export default App;
