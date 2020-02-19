import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Proptypes from "prop-types";
import icon from "../assets/icon.png";

import { signUpUser } from "../redux/actions/userActions";

import withStyles from "@material-ui/core/styles/withStyles";
import { Grid, Typography, TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

import { styles } from "../util/styles/styles";

const SignUp = ({ classes, history }) => {
  const dispatch = useDispatch();
  const errors = useSelector(state => state.ui.errors);
  const loading = useSelector(state => state.ui.loading);

  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const handleSubmit = event => {
    event.preventDefault();

    const newUserToSignUp = {
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
      name: user.name
    };
    dispatch(signUpUser(newUserToSignUp, history));
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
          Sign up!
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
            error={errors.general || errors.email ? true : false}
            helperText={errors.email}
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
            error={errors.general || errors.password ? true : false}
            helperText={errors.password}
            fullWidth
          />
          <TextField
            className={classes.fields}
            name="confirmPassword"
            id="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            type="password"
            label="Confirm Password"
            error={errors.general || errors.confirmPassword ? true : false}
            helperText={errors.confirmPassword}
            fullWidth
          />
          <TextField
            className={classes.fields}
            name="name"
            id="name"
            value={user.name}
            onChange={handleChange}
            type="name"
            label="Your Name"
            error={errors.name ? true : false}
            helperText={errors.name}
            fullWidth
          />
          {user.email &&
          user.password &&
          user.confirmPassword &&
          user.name !== "" ? (
            <Button
              variant="contained"
              type="submit"
              color="secondary"
              className={classes.button}
            >
              Sign up
              {loading && <CircularProgress className={classes.loading} />}
            </Button>
          ) : (
            <Button
              disabled
              type="submit"
              color="secondary"
              className={classes.button}
            >
              Sign up
            </Button>
          )}
          <br />
          <small>
            already have an account?
            <Link className={classes.link} to="/login">
              log in!
            </Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
};

SignUp.prototype = {
  classes: Proptypes.object.isRequired,
  handleSubmit: Proptypes.func.isRequired,
  handleChange: Proptypes.func.isRequired,
  signUpUser: Proptypes.func.isRequired,
  ui: Proptypes.object.isRequired,
  errors: Proptypes.array.isRequired,
  loading: Proptypes.bool.isRequired,
  dispatch: Proptypes.func.isRequired
};

export default withStyles(styles)(SignUp);
