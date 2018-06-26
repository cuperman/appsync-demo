import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

class NavbarTop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNavbarOpen: false
    };

    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  toggleNavbar() {
    this.setState({
      isNavbarOpen: !this.state.isNavbarOpen
    });
  }

  render() {
    const { toggleNavbar } = this;
    const { currentUser, onSignOut } = this.props;
    const { isNavbarOpen } = this.state;

    return (
      <Navbar color="dark" dark expand="md" fixed="top">
        <Link className="navbar-brand" to="/">appsync-demo</Link>
        <NavbarToggler onClick={toggleNavbar} />
        <Collapse isOpen={isNavbarOpen} navbar>
          <Nav className="ml-auto" navbar>
            {currentUser && (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  {currentUser.username}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={onSignOut}>
                    Sign out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

NavbarTop.propTypes = {
  currentUser: PropTypes.object,
  onSignOut: PropTypes.func.isRequired
};

export default NavbarTop;
