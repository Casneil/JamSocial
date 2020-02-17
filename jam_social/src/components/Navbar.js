import React from "react";
import { Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

const Navbar = () => {
  return (
    <>
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
    </>
  );
};

export default Navbar;
