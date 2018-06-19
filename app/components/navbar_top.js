import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from 'reactstrap';

class NavbarTop extends React.Component {
  render() {
    return (
      <Navbar color="dark" dark expand="md" fixed="top">
        <Link className="navbar-brand" to="/">appsync-demo</Link>
      </Navbar>
    );
  }
}

export default NavbarTop;
