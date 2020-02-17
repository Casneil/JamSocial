import React, { useState } from "react";
import { Link } from "react-router-dom";
import Proptypes from "prop-types";
import icon from "../assets/icon.png";

import axios from "axios";

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

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = event => {
    event.preventDefault();

    const userdata = {
      email: user.email,
      password: user.password
    };

    setLoading(true);
    axios
      .post(`/login`, userdata)
      .then(response => {
        console.log(response.data);
        localStorage.setItem("firebaseToken", `Bearer ${response.data.token}`);
        setLoading(false);
        history.push("/");
      })
      .catch(error => {
        setErrors(error.response.data);
        setLoading(false);
      });
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
  handleChange: Proptypes.func.isRequired
};

export default withStyles(styles)(Login);
