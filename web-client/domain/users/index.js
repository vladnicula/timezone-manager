import axios from 'axios';
import { client } from 'config';

import {
  SET_USERS,
  USERS_OPERATION_START,
  USERS_OPERATION_SUCCESS,
  USERS_OPERATION_ERROR,
  SET_CURRENT_USER,
  CLEAR_USERS_ERROR,
} from './actions';

import {
  CLEAR_AUTH_TOKEN,
} from '../auth/actions';

const { API_ENDPOINT } = client;

const fetchUsers = accessToken => async (dispatch) => {
  dispatch({
    type: USERS_OPERATION_START,
  });

  const jwt = accessToken;
  const authOptions = {
    headers: {
      'x-access-token': jwt,
    },
  };

  try {
    const response = await axios.get(
      `${API_ENDPOINT}/api/v1/user`,
      authOptions,
    );

    dispatch({
      type: SET_USERS,
      users: response.data.users,
    });
  } catch (err) {
    if (err.response && err.response.data.message) {
      if (err.response.data.message.indexOf('Action not allowed with curreny user role') !== -1) {
        dispatch({
          type: CLEAR_AUTH_TOKEN,
        });
      }
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: err.response.data.message,
      });
    } else if (err.message === 'Network Error') {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: 'API Server not reachable',
      });
    } else {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: err.toString(),
      });
    }
  }
};

export { fetchUsers };

const fetchMe = accessToken => async (dispatch) => {
  dispatch({
    type: USERS_OPERATION_START,
  });

  const jwt = accessToken;
  const authOptions = {
    headers: {
      'x-access-token': jwt,
    },
  };
  try {
    const response = await axios.get(
      `${API_ENDPOINT}/api/v1/user/me`,
      authOptions,
    );

    dispatch({
      type: SET_CURRENT_USER,
      currentUser: response.data.users[0],
    });
  } catch (err) {
    if (err.response && err.response.data.message) {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: err.response.data.message,
      });
    } else if (err.message === 'Network Error') {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: 'API Server not reachable',
      });
    } else {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: err.toString(),
      });
    }
  }
};

export { fetchMe };

/**
 * Create a Users and then fetch entire list of Users
 * either for current user or for another user, with or without filters
 * and pagination
 */
const createUser = (accessToken, userData) => async (dispatch) => {
  dispatch({
    type: USERS_OPERATION_START,
  });

  const jwt = accessToken;
  const authOptions = {
    headers: {
      'x-access-token': jwt,
    },
  };

  try {
    await axios.post(
      `${API_ENDPOINT}/api/v1/user`,
      userData,
      authOptions,
    );

    dispatch({
      type: USERS_OPERATION_SUCCESS,
    });
  } catch (err) {
    if (err.response && err.response.data.message) {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: err.response.data.message,
      });
    } else if (err.message === 'Network Error') {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: 'API Server not reachable',
      });
    } else {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: err.toString(),
      });
    }
  }
};

export { createUser };


/**
 * Deletes a timezone. Assumes api checks roles and priviledges
 */
const deleteUser = (accessToken, userId) => async (dispatch) => {
  dispatch({
    type: USERS_OPERATION_START,
  });

  const jwt = accessToken;
  const authOptions = {
    headers: {
      'x-access-token': jwt,
    },
  };

  try {
    await axios.delete(
      `${API_ENDPOINT}/api/v1/user/${userId}`,
      authOptions,
    );

    dispatch({
      type: USERS_OPERATION_SUCCESS,
    });
  } catch (err) {
    if (err.response && err.response.data.message) {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: err.response.data.message,
      });
    } else if (err.message === 'Network Error') {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: 'API Server not reachable',
      });
    } else {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: err.toString(),
      });
    }
  }
};

export { deleteUser };

/**
 * Updates a timezone identified by id. Assumes roles and priviledges
 * are checked by the api.
 */
const updateUser = (accessToken, userId, patchPayload) => async (dispatch) => {
  dispatch({
    type: USERS_OPERATION_START,
  });

  const jwt = accessToken;
  const authOptions = {
    headers: {
      'x-access-token': jwt,
    },
  };

  try {
    await axios.patch(
      `${API_ENDPOINT}/api/v1/user/${userId}`,
      patchPayload,
      authOptions,
    );

    dispatch({
      type: USERS_OPERATION_SUCCESS,
    });
  } catch (err) {
    if (err.response && err.response.data.message) {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: err.response.data.message,
      });
    } else if (err.message === 'Network Error') {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: 'API Server not reachable',
      });
    } else {
      dispatch({
        type: USERS_OPERATION_ERROR,
        error: err.toString(),
      });
    }
  }
};

export { updateUser };

const clearUsersError = () => ({
  type: CLEAR_USERS_ERROR,
});

export { clearUsersError };

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_USERS:
      return { ...state,
        users: action.users,
      };
    case USERS_OPERATION_START:
      return {
        ...state,
        working: true,
      };
    case USERS_OPERATION_SUCCESS:
      return {
        ...state,
        working: false,
        error: null,
      };
    case USERS_OPERATION_ERROR:
      return {
        ...state,
        working: false,
        error: action.error || 'unknown error',
      };

    case SET_CURRENT_USER:
      return {
        ...state,
        working: false,
        currentUser: action.currentUser,
      };

    case CLEAR_AUTH_TOKEN:
      return {
        ...state,
        currentUser: {
          _id: '',
          username: '',
          role: 0,
        },
      };

    case CLEAR_USERS_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default reducer;
