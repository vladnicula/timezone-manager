import axios from 'axios';
import cookie from 'js-cookie';

import {
  SET_AUTH_TOKEN,
  CLEAR_AUTH_TOKEN,
} from './actions';

const authenticate = ({ username, password }) => async (dispatch) => {
  try {
    const response = await axios.post(
      'http://localhost:3185/api/v1/user/authenticate',
      { username, password },
    );

    cookie.set('jwt', response.data.token);

    dispatch({
      type: SET_AUTH_TOKEN,
      token: response.data.token,
    });
  } catch (err) {
    console.log('login error', err);
  }
};

export { authenticate };


const signup = ({ username, password }) => async (dispatch) => {
  try {
    await axios.post(
      'http://localhost:3185/api/v1/user',
      { username, password },
    );

    const response = await axios.post(
      'http://localhost:3185/api/v1/user/authenticate',
      { username, password },
    );

    cookie.set('jwt', response.data.token);

    dispatch({
      type: SET_AUTH_TOKEN,
      token: response.data.token,
    });
  } catch (err) {
    console.log('signup error', err);
  }
};

export { signup };

const logout = () => {
  cookie.remove('jwt');
  return {
    type: CLEAR_AUTH_TOKEN,
  };
};

export { logout };

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_AUTH_TOKEN:
      return { ...state, token: action.token };
    case CLEAR_AUTH_TOKEN:
      return { ...state, token: null };
    default:
      return state;
  }
};

export default reducer;
