import React from 'react';
import { connect } from 'react-redux';

import {
  fetchEvents,
  fetchEventComments,
  subscribeToEventComments,
  createEvent,
  commentOnEvent
} from '../actions';

class ActionTester extends React.PureComponent {
  render() {
    return <div style={{display: 'none'}}></div>;
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  const actions = {
    fetchEvents: () => dispatch(fetchEvents()),
    fetchEventComments: (eventId) => dispatch(fetchEventComments(eventId)),
    subscribeToEventComments: (eventId) => dispatch(subscribeToEventComments(eventId)),
    createEvent: (name, where, when, description) => dispatch(createEvent(name, where, when, description)),
    commentOnEvent: (eventId, content) => dispatch(commentOnEvent(eventId, content))
  };

  window.actions = actions;

  return actions;
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionTester);
