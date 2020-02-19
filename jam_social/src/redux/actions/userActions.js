import {
  SET_ERRORS,
  LOADING_UI,
  CLEAR_ERRORS,
  SET_USER
} from "../reducers/types";

import axios from "axios";

export const loginUser = (userInfo, history) => dispatch => {
  console.log(history);
  dispatch({ type: LOADING_UI });
  axios
    .post(`/login`, userInfo)
    .then(response => {
      const firebaseToken = `Bearer ${response.data.token}`;
      localStorage.setItem("firebaseToken", firebaseToken);
      axios.defaults.headers.common["Authorization"] = firebaseToken;
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
