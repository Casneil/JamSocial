import React from "react";
import "./App.css";
import jwtDecode from "jwt-decode";

import Navbar from "./components/Navbar";
import Router from "./components/Router";

import { ThemeProvider } from "@material-ui/core/styles";

import { theme } from "./util/styles/styles";

const token = localStorage.firebaseToken;
let authed;

if (token) {
  const decode = jwtDecode(token);
  var currentTime = Date.now();

  if (decode.exp * 1000 < currentTime) {
    window.location.href = "/login";

    authed = false;
  } else {
    authed = true;
  }
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <div>
        <Router />
      </div>
    </ThemeProvider>
  );
}

export default App;
