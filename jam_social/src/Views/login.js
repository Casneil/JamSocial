import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Proptypes from "prop-types";
import icon from "../assets/icon.png";

import { loginUser } from "../redux/actions/userActions";

import withStyles from "@material-ui/core/styles/withStyles";
import { Grid, Typography, TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

import { styles } from "../util/styles/styles";

const Login = ({ classes, history }) => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const dispatch = useDispatch();
  const errors = useSelector(state => state.ui.errors);
  const loading = useSelector(state => state.ui.loading);
  const users = useSelector(state => state.user);
  console.log(users);

  const handleSubmit = event => {
    event.preventDefault();

    const userInfo = {
      email: user.email,
      password: user.password
    };

    dispatch(loginUser(userInfo, history));
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  return (
    <Grid container className={classes.content}>
      <Grid item sm />
      <Grid item sm>
        <img src={icon} className={classes.image} alt="icon" />
        <Typography variant="h3" className={classes.title}>
          Login!
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            className={classes.fields}
            name="email"
            id="email"
            value={user.email}
            onChange={handleChange}
            type="email"
            label="Email"
            error={errors.general ? true : false}
            helperText={errors.general}
            fullWidth
          />
          <TextField
            className={classes.fields}
            name="password"
            id="password"
            value={user.password}
            onChange={handleChange}
            type="password"
            label="Password"
            error={errors.general ? true : false}
            helperText={errors.general}
            fullWidth
          />
          {user.email && user.password !== "" ? (
            <Button
              variant="contained"
              type="submit"
              color="secondary"
              className={classes.button}
            >
              Login{" "}
              {loading && <CircularProgress className={classes.loading} />}
            </Button>
          ) : (
            <Button
              disabled
              type="submit"
              color="secondary"
              className={classes.button}
            >
              Login
            </Button>
          )}
          <br />
          <small>
            don't have an account?
            <Link className={classes.link} to="/signup">
              sign up!
            </Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
};

Login.prototype = {
  classes: Proptypes.object.isRequired,
  handleSubmit: Proptypes.func.isRequired,
  handleChange: Proptypes.func.isRequired,
  user: Proptypes.object.isRequired,
  loginUser: Proptypes.func.isRequired,
  loading: Proptypes.bool.isRequired,
  errors: Proptypes.array.isRequired,
  dispatch: Proptypes.func.isRequired
};

export default withStyles(styles)(Login);
