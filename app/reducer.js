import { assign, concat, find } from 'lodash';

import {
  FETCH_EVENTS_COMPLETE,
  FETCH_MORE_EVENTS_COMPLETE,
  FETCH_EVENT_COMMENTS_COMPLETE,
  FETCH_MORE_EVENT_COMMENTS_COMPLETE,
  RECEIVED_EVENT_COMMENT,
  CREATE_EVENT_COMPLETE,
  CREATE_EVENT_FAILED
} from './actions';

const initialState = {
  events: {
    // items: [],
    // nextToken: null
  },
  comments: {
    // 'EVENT_ID': {
    //   items: [],
    //   nextToken: null
    // }
  },
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_EVENTS_COMPLETE:
      return assign({}, state, {
        events: {
          items: action.events,
          nextToken: action.nextToken
        },
        error: null
      });
    case FETCH_MORE_EVENTS_COMPLETE:
      return assign({}, state, {
        events: {
          items: concat(state.events.items, action.events),
          nextToken: action.nextToken
        },
        error: null
      });
    case FETCH_EVENT_COMMENTS_COMPLETE:
      return assign({}, state, {
        comments: assign({}, state.comments, {
          [action.eventId]: {
            items: action.comments,
            nextToken: action.nextToken
          }
        }),
        error: null
      });
    case FETCH_MORE_EVENT_COMMENTS_COMPLETE:
      return assign({}, state, {
        comments: assign({}, state.comments, {
          [action.eventId]: {
            items: concat(state.comments[action.eventId].items, action.comments),
            nextToken: action.nextToken
          }
        }),
        error: null
      });
    case RECEIVED_EVENT_COMMENT:
      if (find(state.comments[action.eventId].items, { commentId: action.comment.commentId })) {
        // duplicate detected; ignore
        return state;
      }
      return assign({}, state, {
        comments: assign({}, state.comments, {
          [action.eventId]: {
            items: concat([action.comment], state.comments[action.eventId].items),
            nextToken: state.comments.nextToken
          }
        })
      });
    case CREATE_EVENT_COMPLETE:
      return assign({}, state, {
        error: null
      });
    case CREATE_EVENT_FAILED:
      return assign({}, state, {
        error: action.error
      });
    default:
      return state;
  }
}
