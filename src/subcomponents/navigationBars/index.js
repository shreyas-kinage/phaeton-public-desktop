import React, { useEffect } from "react";
import NavBar from './navBar/Nav';
import './nav.css';

const NavigationBars = () => {

  useEffect(() => {
    try {
      let logincheck = sessionStorage.getItem("loggedIn");
      if (logincheck == "true") {
        setIsLoggedIn(true);
      }
    }
    catch {
    }
  }, []);

  <>
    <NavBar />
  </>
};

export default NavigationBars;
