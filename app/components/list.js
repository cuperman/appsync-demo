import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { UncontrolledAlert } from 'reactstrap';

import { fetchEvents } from '../actions';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.handleMoreEvents = this.handleMoreEvents.bind(this);
  }

  handleMoreEvents(event) {
    event.preventDefault();
    this.props.fetchEvents(this.props.nextToken);
  }

  render() {
    const { handleMoreEvents } = this;
    const { events, nextToken, error } = this.props;

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
        <section>
          {error && error.errors.map(error => {
            return (
              <UncontrolledAlert color="danger" key={error.message}>
                {error.message}
              </UncontrolledAlert>
            );
          })}
        </section>
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
          <div className="d-flex justify-content-center mb-2">
            {nextToken && <button className="btn btn-link" onClick={handleMoreEvents}>More</button>}
          </div>
        </main>
      </div>
    );
  }
}

List.propTypes = {
  events: PropTypes.array.isRequired,
  fetchEvents: PropTypes.func.isRequired,
  nextToken: PropTypes.string,
  error: PropTypes.object
};

function mapStateToProps(state) {
  const events = state.events && state.events.items || [];
  const nextToken = state.events && state.events.nextToken;
  const error = state.error;

  return {
    events,
    nextToken,
    error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchEvents: (nextToken) => dispatch(fetchEvents(nextToken))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
