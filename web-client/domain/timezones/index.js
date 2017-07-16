import axios from 'axios';
import cookie from 'js-cookie';
import { client } from 'config';

import {
  SET_TIMEZONES,
  TIMEZONE_OPERATION_START,
  TIMEZONE_OPERATION_SUCCESS,
  TIMEZONE_OPERATION_ERROR,
  CLEAR_TIMEZONE_ERROR,
} from './actions';


const { API_ENDPOINT } = client;

const fetchTimezones = (authToken, { userId, nameFilter }) => async (dispatch) => {
  dispatch({
    type: TIMEZONE_OPERATION_START,
  });

  const jwt = authToken || cookie.get('jwt');
  const authOptions = {
    headers: {
      'x-access-token': jwt,
    },
  };

  let extras = '';
  if (nameFilter) {
    extras = `${extras}filter_name=${encodeURIComponent(nameFilter)}&`;
  }

  if (userId) {
    extras = `${extras}user_id=${userId}&`;
  }

  if (extras) {
    extras = `?${extras}`;
  }

  try {
    const response = await axios.get(
      `${API_ENDPOINT}/api/v1/timezone${extras}`,
      authOptions,
    );

    dispatch({
      type: SET_TIMEZONES,
      timezones: response.data.timezones,
    });
  } catch (err) {
    if (err.response && err.response.data.message) {
      dispatch({
        type: TIMEZONE_OPERATION_ERROR,
        error: err.response.data.message,
      });
    } else if (err.message === 'Network Error') {
      dispatch({
        type: TIMEZONE_OPERATION_ERROR,
        error: 'API Server not reachable',
      });
    } else {
      dispatch({
        type: TIMEZONE_OPERATION_ERROR,
        error: err.toString(),
      });
    }
  }
};

export { fetchTimezones };

/**
 * Create a timezones and then fetch entire list of timezones
 * either for current user or for another user, with or without filters
 * and pagination
 */
const createTimezone = timezoneData => async (dispatch) => {
  dispatch({
    type: TIMEZONE_OPERATION_START,
  });

  const jwt = cookie.get('jwt');
  const authOptions = {
    headers: {
      'x-access-token': jwt,
    },
  };

  try {
    await axios.post(
      'http://localhost:3185/api/v1/timezone',
      timezoneData,
      authOptions,
    );

    dispatch({
      type: TIMEZONE_OPERATION_SUCCESS,
    });
  } catch (err) {
    if (err.response && err.response.data.message) {
      dispatch({
        type: TIMEZONE_OPERATION_ERROR,
        error: err.response.data.message,
      });
    } else if (err.message === 'Network Error') {
      dispatch({
        type: TIMEZONE_OPERATION_ERROR,
        error: 'API Server not reachable',
      });
    } else {
      dispatch({
        type: TIMEZONE_OPERATION_ERROR,
        error: err.toString(),
      });
    }
  }
};

export { createTimezone };


/**
 * Deletes a timezone. Assumes api checks roles and priviledges
 */
const deleteTimezone = timezoneId => async (dispatch) => {
  dispatch({
    type: TIMEZONE_OPERATION_START,
  });

  const jwt = cookie.get('jwt');
  const authOptions = {
    headers: {
      'x-access-token': jwt,
    },
  };

  try {
    await axios.delete(
      `${API_ENDPOINT}/api/v1/timezone/${timezoneId}`,
      authOptions,
    );

    dispatch({
      type: TIMEZONE_OPERATION_SUCCESS,
    });
  } catch (err) {
    if (err.response && err.response.data.message) {
      dispatch({
        type: TIMEZONE_OPERATION_ERROR,
        error: err.response.data.message,
      });
    } else if (err.message === 'Network Error') {
      dispatch({
        type: TIMEZONE_OPERATION_ERROR,
        error: 'API Server not reachable',
      });
    } else {
      dispatch({
        type: TIMEZONE_OPERATION_ERROR,
        error: err.toString(),
      });
    }
  }
};

export { deleteTimezone };

/**
 * Updates a timezone identified by id. Assumes roles and priviledges
 * are checked by the api.
 */
const updateTimezone = (timezoneId, patchPayload) => async (dispatch) => {
  dispatch({
    type: TIMEZONE_OPERATION_START,
  });

  const jwt = cookie.get('jwt');
  const authOptions = {
    headers: {
      'x-access-token': jwt,
    },
  };

  try {
    await axios.patch(
      `${API_ENDPOINT}/api/v1/timezone/${timezoneId}`,
      patchPayload,
      authOptions,
    );

    dispatch({
      type: TIMEZONE_OPERATION_SUCCESS,
    });
  } catch (err) {
    if (err.response && err.response.data.message) {
      dispatch({
        type: TIMEZONE_OPERATION_ERROR,
        error: err.response.data.message,
      });
    } else if (err.message === 'Network Error') {
      dispatch({
        type: TIMEZONE_OPERATION_ERROR,
        error: 'API Server not reachable',
      });
    } else {
      dispatch({
        type: TIMEZONE_OPERATION_ERROR,
        error: err.toString(),
      });
    }
  }
};

export { updateTimezone };

const clearTimezoneError = () => ({
  type: CLEAR_TIMEZONE_ERROR,
});

export { clearTimezoneError };

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_TIMEZONES:
      return { ...state,
        working: false,
        timezones: action.timezones,
      };
    case TIMEZONE_OPERATION_START:
      return {
        ...state,
        working: true,
      };
    case TIMEZONE_OPERATION_SUCCESS:
      return {
        ...state,
        working: false,
        error: null,
      };
    case TIMEZONE_OPERATION_ERROR:
      return {
        ...state,
        working: false,
        error: action.error || 'unknown error',
      };

    case CLEAR_TIMEZONE_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default reducer;
