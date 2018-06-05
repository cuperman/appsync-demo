import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { createEvent } from '../actions';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      where: null,
      when: null,
      description: null
    };

    this.onFieldChange = this.onFieldChange.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
  }

  onFieldChange(event) {
    const target = event.target;
    const { name, value } = target;

    this.setState({
      [name]: value
    });
  }

  saveEvent(event) {
    event.preventDefault();

    const { createEvent, history } = this.props;
    const { name, where, when, description } = this.state;

    createEvent(name, where, when, description);
    history.push('/');
  }

  render() {
    const { saveEvent, onFieldChange } = this;

    return (
      <div className="container">
        <header className="pb-2 mt-4 mb-2 border-bottom">
          <h1>New Event</h1>
        </header>
        <main>
          <form onSubmit={saveEvent}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input name="name" type="text" className="form-control" onChange={onFieldChange} />
            </div>
            <div className="form-group">
              <label htmlFor="where">Where</label>
              <input name="where" type="text" className="form-control" onChange={onFieldChange} />
            </div>
            <div className="form-group">
              <label htmlFor="when">When</label>
              <input name="when" type="text" className="form-control" onChange={onFieldChange} />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea name="description" className="form-control" onChange={onFieldChange}></textarea>
            </div>
            <div className="form-group float-right">
              <Link to="/" className="btn btn-dark mr-2">Cancel</Link>
              <button className="btn btn-primary">Save</button>
            </div>
          </form>
        </main>
      </div>
    );
  }
}

Form.propTypes = {
  createEvent: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    createEvent: (name, where, when, description) => dispatch(createEvent(name, where, when, description))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
