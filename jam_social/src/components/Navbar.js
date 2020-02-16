import React from "react";
import { Link } from "react-router-dom";

import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

const Navbar = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="fixed">
        <Toolbar className="nav-container">
          <Button color="inherit" component={Link} to="/">
            home
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            sign up
          </Button>
          <Button color="inherit" component={Link} to="/login">
            login
          </Button>
        </Toolbar>
      </AppBar>
    </MuiThemeProvider>
  );
};

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#76ff03",
      main: "#64dd17",
      dark: "#33691e",
      contrastText: "#fff"
    },
    secondary: {
      light: "#76ff03",
      main: "#64dd17",
      dark: "#33691e",
      contrastText: "#fff"
    }
  }
});

export default Navbar;
