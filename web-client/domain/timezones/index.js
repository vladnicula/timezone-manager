import axios from 'axios';
import cookie from 'js-cookie';

import {
  SET_TIMEZONES,
  TIMEZONE_OPERATION_START,
  TIMEZONE_OPERATION_SUCCESS,
  TIMEZONE_OPERATION_ERROR,
} from './actions';


const fetchTimezones = () => async (dispatch) => {
  dispatch({
    type: TIMEZONE_OPERATION_START,
  });

  const jwt = cookie.get('jwt');
  const authOptions = {
    headers: {
      'x-access-token': jwt,
    },
  };

  const response = await axios.get(
    'http://localhost:3185/api/v1/timezone',
    authOptions,
  );

  dispatch({
    type: SET_TIMEZONES,
    timezones: response.data.timezones,
  });
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

    await fetchTimezones()(dispatch);

    dispatch({
      type: TIMEZONE_OPERATION_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: TIMEZONE_OPERATION_ERROR,
      error: err,
    });
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
      `http://localhost:3185/api/v1/timezone/${timezoneId}`,
      authOptions,
    );

    await fetchTimezones()(dispatch);

    dispatch({
      type: TIMEZONE_OPERATION_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: TIMEZONE_OPERATION_ERROR,
      error: err,
    });
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
      `http://localhost:3185/api/v1/timezone/${timezoneId}`,
      patchPayload,
      authOptions,
    );

    await fetchTimezones()(dispatch);

    dispatch({
      type: TIMEZONE_OPERATION_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: TIMEZONE_OPERATION_ERROR,
      error: err,
    });
  }
};

export { updateTimezone };

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_TIMEZONES:
      return { ...state,
        timezones: action.timezones,
      };
    case TIMEZONE_OPERATION_START:
      return {
        ...state,
        working: true,
        error: false,
      };
    case TIMEZONE_OPERATION_SUCCESS:
      return {
        ...state,
        working: false,
        error: false,
      };
    case TIMEZONE_OPERATION_ERROR:
      return {
        ...state,
        working: false,
        error: action.error || 'unknown error',
      };
    default:
      return state;
  }
};

export default reducer;
