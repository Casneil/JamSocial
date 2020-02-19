import {
  SET_ERRORS,
  LOADING_UI,
  SET_UNAUTHED,
  CLEAR_ERRORS,
  SET_USER,
  SET_AUTHED
} from "../reducers/types";

const iniitialState = {
  authed: false,
  credentials: {},
  likes: [],
  notifications: []
};

export default function(state = iniitialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        authed: true,
        ...action.payload
      };
    case SET_AUTHED:
      return {
        ...state,
        authed: true
      };
    case SET_UNAUTHED:
      return {
        iniitialState
      };

    default:
      return state;
  }
}
