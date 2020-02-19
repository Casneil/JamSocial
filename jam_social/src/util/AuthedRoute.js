import React from "react";
import { Route, Redirect } from "react-router-dom";

import Proptypes from "prop-types";

const AuthedRoute = ({ component: Component, authed, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authed === true ? <Redirect to="/" /> : <Component {...props} />
    }
  />
);

AuthedRoute.prototype = {
  authed: Proptypes.bool.isRequired
};

export default AuthedRoute;
