import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import auth from './auth';

const store = createStore(
  combineReducers({
    auth,
  }),
  applyMiddleware(thunk),
);

export default store;
