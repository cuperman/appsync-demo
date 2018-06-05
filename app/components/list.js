import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchEvents } from '../actions';

class List extends React.Component {
  componentDidMount() {
    const { fetchEvents } = this.props;
    fetchEvents();
  }

  render() {
    const { events } = this.props;

    return (
      <div className="container">
        <header className="pb-2 mt-4 mb-2">
          <h1>
            Upcoming Events
            <nav className="float-right">
              <Link to="/new" className="btn btn-outline-success">New Event</Link>
            </nav>
          </h1>
        </header>
        <main>
          <div className="card-columns">
            {events.map(event => {
              const { id, name, where, when, description } = event;

              return (
                <div key={id} className="card">
                  <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{where} @ {when}</h6>
                    <p className="card-text">{description}</p>
                    <Link to={`/show/${id}`} className="btn btn-outline-primary">View</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }
}

List.propTypes = {
  events: PropTypes.array.isRequired,
  fetchEvents: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    events: state.events
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchEvents: () => dispatch(fetchEvents())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
