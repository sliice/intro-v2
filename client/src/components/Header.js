import React, {useContext, Component, useEffect} from 'react';
import './appearence/css/index.css'
import {AuthContext} from "./context/AuthContext";
import {useHistory} from "react-router-dom";

export const Header = () => {

    const history = useHistory()
    const {logout} = useContext(AuthContext)

    const logoutHandler = e => {
      e.preventDefault()
      logout()
      history.push('/')
    }

    return (
        <div className = 'headerZone'>
          <div className = 'logoutbtn' title = 'Выйти' onClick = {e => logoutHandler(e)}>
              <a href = '/'/>
              <svg className = 'logoutTriangle' width="65px" height="65px" viewBox="0 0 65 65" version="1.1">
                  <g id="Logo" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <path d="M30.1959966,25.7135946 L39.0875013,39.9400021 C39.672922,40.8766752 39.3881757,42.1105759 38.4515026,42.6959966 C38.1336394,42.8946611 37.7663442,43 37.3915047,43 L19.6084953,43 C18.5039258,43 17.6084953,42.1045695 17.6084953,41 C17.6084953,40.6251606 17.7138342,40.2578653 17.9124987,39.9400021 L26.8040034,25.7135946 C27.3894241,24.7769215 28.6233248,24.4921752 29.5599979,25.0775958 C29.8175361,25.2385573 30.0350352,25.4560563 30.1959966,25.7135946 Z" id="Triangle" fill="#FFFFFF" transform="translate(28.500000, 33.000000) rotate(-90.000000) translate(-28.500000, -33.000000) "></path>
                  </g>
              </svg>
          </div>
        </div>
    );
}
  export default Header

