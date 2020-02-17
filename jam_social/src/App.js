import React from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Router from "./components/Router";

import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider } from "@material-ui/core/styles";

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

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#76ff03",
      main: "#64dd17",
      dark: "#33691e",
      contrastText: "#fff"
    },
    secondary: {
      light: "#8bc34a",
      main: "#689f38",
      dark: "#33691e",
      contrastText: "#fff"
    }
  }
});

export default App;
