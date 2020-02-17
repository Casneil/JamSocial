import React, { useState } from "react";
import { Link } from "react-router-dom";
import Proptypes from "prop-types";
import icon from "../assets/icon.png";

import axios from "axios";

import withStyles from "@material-ui/core/styles/withStyles";
import { Grid, Typography, TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

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

const styles = {
  content: {
    textAlign: "center"
  },
  image: {
    maxWidth: 100,
    margin: "15px auto 15px auto"
  },
  title: {
    margin: "8px auto 8px auto"
  },
  fields: {
    margin: "10px auto 10px auto"
  },
  button: {
    margin: "15px auto 15px auto",
    position: "relative"
  },
  link: {
    color: "#689f38",
    margin: "5px 5px 5px 5px"
  },
  loading: {
    position: "absolute"
  }
};

export default withStyles(styles)(Login);
