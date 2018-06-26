import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import NavbarTop from './navbar_top';
import List from './list';
import Form from './form';
import Item from './item';
import { fetchEvents } from '../actions';

const styles = {
  main: {
    padding: '60px 15px 0'
  }
};

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null
    };

    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    Auth.currentUserInfo()
      .then(data => {
        this.setState({
          currentUser: data
        });

        this.props.fetchEvents();
      });
  }

  handleSignOut(event) {
    if (event) { event.preventDefault(); }
    Auth.signOut();
  }

  render() {
    const { handleSignOut } = this;
    const { currentUser } = this.state;

    return (
      <div>
        <header>
          <NavbarTop
            currentUser={currentUser}
            onSignOut={handleSignOut} />
        </header>
        <main style={styles.main}>
          <Route exact path="/" component={List} />
          <Route path="/new" component={routeProps => <Form {...Object.assign({}, routeProps, { currentUser })} />}  />
          <Route path="/show/:id" component={routeProps => <Item {...Object.assign({}, routeProps, { currentUser })} />} />
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

export default withAuthenticator(withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout)));
