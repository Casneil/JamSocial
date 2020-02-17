import React from "react";
import { Switch, Route } from "react-router-dom";

import Home from "../Views/home";
import Login from "../Views/login";
import SignUp from "../Views/signUp";
import AuthedRoute from "../util/AuthedRoute";

const Router = ({ authed }) => {
  return (
    <div className="container">
      <Switch>
        <Route exact path="/" component={Home} />
        <AuthedRoute exact path="/login" component={Login} authed={authed} />
        <AuthedRoute exact path="/signup" component={SignUp} authed={authed} />
      </Switch>
    </div>
  );
};

export default Router;
