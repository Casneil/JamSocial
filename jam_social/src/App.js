import React from "react";
import Proptypes from "prop-types";
import { useDispatch } from "react-redux";
import "./App.css";

import axios from "axios";
import jwtDecode from "jwt-decode";

import { SET_AUTHED } from "./redux/types";
import { getUserData, logout } from "./redux/actions/userActions";

import Navbar from "./components/Navbar";
import Router from "./components/Router";

import { ThemeProvider } from "@material-ui/core/styles";

import { theme } from "./util/styles/styles";

const App = () => {
  const dispatch = useDispatch();

  const token = localStorage.firebaseToken;

  if (token) {
    const decode = jwtDecode(token);
    var currentTime = Date.now();

    if (decode.exp * 1000 < currentTime) {
      window.location.href = "/login";
      dispatch(logout());
    } else {
      dispatch({ type: SET_AUTHED });
      axios.defaults.headers.common["Autthorization"] = token;
      dispatch({ type: getUserData() });
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <div>
        <Router />
      </div>
    </ThemeProvider>
  );
};

App.prototype = {
  logout: Proptypes.func.isRequired,
  dispatch: Proptypes.func.isRequired,
  getUserData: Proptypes.func.isRequired
};

export default App;
