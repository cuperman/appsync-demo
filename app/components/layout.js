import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';

import NavbarTop from './navbar_top';
import List from './list';
import Form from './form';
import Item from './item';
import { fetchEvents } from '../actions';

class Layout extends React.Component {
  componentDidMount() {
    this.props.fetchEvents();
  }

  render() {
    return (
      <div>
        <header>
          <NavbarTop />
        </header>
        <main>
          <Route exact path="/" component={List} />
          <Route path="/new" component={Form} />
          <Route path="/show/:id" component={Item} />
        </main>
      </div>
    );
  }
}

Layout.propTypes = {
  fetchEvents: PropTypes.func.isRequired
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    fetchEvents: () => dispatch(fetchEvents())
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));
