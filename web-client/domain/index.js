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

const store = createStore(
  reducer,
  getComposeEnhancers()(applyMiddleware(thunk)),
);

export default store;
