import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { configureStore } from './store';
import { configureAmplify } from './amplify';
import Layout from './components/layout';

const root = document.getElementById('root');
const store = configureStore();

configureAmplify();

ReactDom.render((
  <Provider store={store}>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </Provider>
), root);
