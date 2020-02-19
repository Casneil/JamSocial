import {
  SET_ERRORS,
  LOADING_UI,
  CLEAR_ERRORS,
  SET_USER,
  SET_UNAUTHED
} from "../types";

import axios from "axios";

const AuthHeader = token => {
  const firebaseToken = `Bearer ${token}`;
  localStorage.setItem("firebaseToken", firebaseToken);
  axios.defaults.headers.common["Authorization"] = firebaseToken;
};

export const signUpUser = (userSignUpInfo, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`/signup`, userSignUpInfo)
    .then(response => {
      AuthHeader(response.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(error => {
      dispatch({
        type: SET_ERRORS,
        payload: error.response.data,
        loading: false
      });
    });
};

export const loginUser = (userInfo, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`/login`, userInfo)
    .then(response => {
      AuthHeader(response.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(error => {
      dispatch({
        type: SET_ERRORS,
        payload: error.response.data,
        loading: false
      });
    });
};

export const getUserData = () => dispatch => {
  axios
    .get("/user")
    .then(response => {
      dispatch({
        type: SET_USER,
        payload: response.data
      });
    })
    .catch(error => console.log(error));
};

export const logout = () => dispatch => {
  localStorage.removeItem("firebaseToken");
  delete axios.defaults.headers.common["Authorization"].dispatch({
    type: SET_UNAUTHED
  });
};
