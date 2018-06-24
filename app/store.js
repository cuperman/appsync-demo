import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import reducer from './reducer';

export function configureStore() {
  return createStore(
    reducer,
    composeWithDevTools(
      applyMiddleware(thunk)
    )
  );
}
