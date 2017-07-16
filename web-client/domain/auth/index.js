import axios from 'axios';
import { client } from 'config';

import {
  SET_AUTH_TOKEN,
  CLEAR_AUTH_TOKEN,
  AUTH_ERROR,
} from './actions';

import {
  fetchMe,
} from '../users/';

const { API_ENDPOINT } = client;

const authenticate = ({ username, password }) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINT}/api/v1/user/authenticate`,
      { username, password },
    );

    const jwt = response.data.token;
    await dispatch(fetchMe(jwt));

    dispatch({
      type: SET_AUTH_TOKEN,
      token: jwt,
    });
  } catch (err) {
    console.log(err, err.response);
    if (err.response && err.response.data.message) {
      dispatch({
        type: AUTH_ERROR,
        error: err.response.data.message,
      });
    } else if (err.message === 'Network Error') {
      dispatch({
        type: AUTH_ERROR,
        error: 'API Server not reachable',
      });
    } else {
      dispatch({
        type: AUTH_ERROR,
        error: err.toString(),
      });
    }
  }
};

export { authenticate };


const signup = ({ username, password }) => async (dispatch) => {
  try {
    await axios.post(
      `${API_ENDPOINT}/api/v1/user`,
      { username, password },
    );

    const response = await axios.post(
      `${API_ENDPOINT}/api/v1/user/authenticate`,
      { username, password },
    );

    const jwt = response.data.token;

    await dispatch(fetchMe(jwt));

    dispatch({
      type: SET_AUTH_TOKEN,
      token: jwt,
    });
  } catch (err) {
    if (err.response && err.response.data.message) {
      dispatch({
        type: AUTH_ERROR,
        error: err.response.data.message,
      });
    } else if (err.message === 'Network Error') {
      dispatch({
        type: AUTH_ERROR,
        error: 'API Server not reachable',
      });
    } else {
      dispatch({
        type: AUTH_ERROR,
        error: err.toString(),
      });
    }
  }
};

export { signup };

const logout = () => ({
  type: CLEAR_AUTH_TOKEN,
});

export { logout };

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_AUTH_TOKEN:
      return { ...state, token: action.token, error: null };
    case CLEAR_AUTH_TOKEN:
      return { ...state, token: null, error: null };
    case AUTH_ERROR:
      return { ...state, token: null, error: action.error };
    default:
      return state;
  }
};

export default reducer;
