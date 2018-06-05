import { assign, concat, findIndex, merge, nth, slice } from 'lodash';

import {
  FETCH_EVENTS_COMPLETE,
  FETCH_EVENT_COMPLETE,
  RECEIVED_EVENT_COMMENTS,
  CREATE_EVENT_FAILED,
  CREATE_EVENT_COMPLETE,
  COMMENT_ON_EVENT_COMPLETE
} from './actions';

const initialState = {
  events: [],
  error: null
};

function findAndReplace(list, conditions, object) {
  const index = findIndex(list, conditions);

  const itemsBefore = slice(list, 0, index);
  const itemsAfter = slice(list, index + 1, list.length);

  return concat(itemsBefore, object, itemsAfter);
}

function findAndMerge(list, conditions, attributes) {
  const index = findIndex(list, conditions);
  const oldItem = nth(list, index);

  const itemsBefore = slice(list, 0, index);
  const itemsAfter = slice(list, index + 1, list.length);

  const newItem = merge({}, oldItem, attributes);

  return concat(itemsBefore, newItem, itemsAfter);
}

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_EVENTS_COMPLETE:
      return {
        events: action.events,
        error: null
      };
    case FETCH_EVENT_COMPLETE:
      return {
        events: findAndReplace(state.events, { id: action.event.id }, action.event),
        error: null
      };
    case COMMENT_ON_EVENT_COMPLETE:
      return {
        events: findAndMerge(state.events, { id: action.eventId }, { comments: [ action.comment ] }),
        error: null
      };
    case RECEIVED_EVENT_COMMENTS:
      return {
        events: findAndMerge(state.events, { id: action.eventId }, { comments: [ action.comment ] }),
        error: null
      };
    case CREATE_EVENT_FAILED:
      return {
        events: state.events,
        error: action.error
      };
    case CREATE_EVENT_COMPLETE:
      return {
        events: concat(state.events, action.event),
        error: null
      };
    default:
      return state;
  }
}
