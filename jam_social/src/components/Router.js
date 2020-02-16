import React, { Fragment } from "react";
import { Switch, Route } from "react-router-dom";

import Home from "../Views/home";
import Login from "../Views/login";
import SignUp from "../Views/signUp";

const Router = () => {
  return (
    <Fragment>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
      </Switch>
    </Fragment>
  );
};

export default Router;
