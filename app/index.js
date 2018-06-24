import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { configureStore } from './store';
import { configureAmplify } from './amplify';
import Layout from './components/layout';


const store = configureStore();
configureAmplify();

const root = document.createElement('div');
document.body.appendChild(root);

ReactDom.render((
  <Provider store={store}>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </Provider>
), root);
