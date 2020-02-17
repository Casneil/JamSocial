import React from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Router from "./components/Router";

import { ThemeProvider } from "@material-ui/core/styles";

import { theme } from "./styles/styles";

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
