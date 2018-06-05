import React from 'react';
import { Route } from 'react-router-dom';

import List from './list';
import Form from './form';
import Item from './item';

class Layout extends React.Component {
  render() {
    return (
      <main>
        <Route exact path="/" component={List} />
        <Route path="/new" component={Form} />
        <Route path="/show/:id" component={Item} />
      </main>
    );
  }
}

export default Layout;
