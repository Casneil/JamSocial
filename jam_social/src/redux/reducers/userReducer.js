import {
  SET_ERRORS,
  LOADING_USER,
  SET_UNAUTHED,
  CLEAR_ERRORS,
  SET_USER,
  SET_AUTHED
} from "../types";

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
        loading: false,
        ...action.payload
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
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
