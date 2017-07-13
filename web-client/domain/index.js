import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import auth from './auth';
import timezones from './timezones';
import users from './users';

// See https://github.com/zalmoxisus/redux-devtools-extension#usage
const getComposeEnhancers = () => {
  if (typeof window !== 'undefined') {
    return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }
  return compose;
};

const reducer = combineReducers({
  auth,
  timezones,
  users,
});

const getInitialState = () => {
  if (typeof window !== 'undefined') {
  // Grab the state from a global variable injected into the server-generated HTML
    const preloadedState = window.__PRELOADED_STATE__;
  // Allow the passed state to be garbage-collected
    delete window.__PRELOADED_STATE__;
    return preloadedState;
  }

  return {};
};

const store = createStore(
  reducer,
  getInitialState(),
  getComposeEnhancers()(applyMiddleware(thunk)),
);

export default store;
