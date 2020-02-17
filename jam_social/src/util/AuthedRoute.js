import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthedRoute = ({ component: Component, authed, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authed === true ? <Redirect to="/" /> : <Component {...props} />
    }
  />
);

export default AuthedRoute;
