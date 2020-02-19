import React from "react";
import Proptypes from "prop-types";

import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";

import Home from "../Views/home";
import Login from "../Views/login";
import SignUp from "../Views/signUp";
import AuthedRoute from "../util/AuthedRoute";

const Router = () => {
  const authed = useSelector(state => state.user.authed);
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

Router.prototype = {
  authed: Proptypes.bool.isRequired,
  useSelector: Proptypes.func.isRequired
};

export default Router;
