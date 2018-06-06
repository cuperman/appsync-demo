import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { assign, pick } from 'lodash';

import { AppSyncConfig } from '../config.json';

// Amplify Configuration

Amplify.configure(AppSyncConfig);

// Action Types

export const FETCH_EVENTS_COMPLETE          = 'FETCH_EVENTS_COMPLETE';
export const FETCH_EVENT_COMPLETE           = 'FETCH_EVENT_COMPLETE';
export const RECEIVED_EVENT_COMMENTS        = 'RECEIVED_EVENT_COMMENTS';
export const CREATE_EVENT_FAILED            = 'CREATE_EVENT_FAILED';
export const CREATE_EVENT_COMPLETE          = 'CREATE_EVENT_COMPLETE';
export const COMMENT_ON_EVENT_FAILED        = 'COMMENT_ON_EVENT_FAILED';
export const COMMENT_ON_EVENT_COMPLETE      = 'COMMENT_ON_EVENT_COMPLETE';

// GraphQL Queries

const FetchEvents = `query EventConnection {
  listEvents {
    items {
      id
      name
      where
      when
      description
    }
  }
}`;

const FetchEvent = `query Event($id: ID!) {
  getEvent(id: $id) {
    id
    name
    where
    when
    description
    comments {
      items {
        commentId
        content
        createdAt
      }
    }
  }
}`;

const SubscribeToEventComments = `subscription Comment($eventId: String!) {
  subscribeToEventComments(eventId: $eventId) {
    commentId
    content
    createdAt
  }
}`;

const CreateEvent = `mutation Event($name: String!, $when: String!, $where: String!, $description: String!) {
  createEvent(name: $name, when: $when, where: $where, description: $description) {
    id
    name
    where
    when
    description
  }
}`;

const CommentOnEvent = `mutation Comment($eventId: ID!, $content: String!, $createdAt: String!) {
  commentOnEvent(eventId: $eventId, content: $content, createdAt: $createdAt) {
    commentId
    content
    createdAt
  }
}`;

// Exported Actions

export function fetchEvents() {
  return dispatch => {
    API.graphql(graphqlOperation(FetchEvents))
      .then(response => {
        dispatch({
          type: FETCH_EVENTS_COMPLETE,
          events: response.data.listEvents.items
        });
      });
  };
}

export function fetchEvent(id) {
  return dispatch => {
    API.graphql(graphqlOperation(FetchEvent, { id }))
      .then(response => {
        const data = response.data;
        dispatch({
          type: FETCH_EVENT_COMPLETE,
          event: assign({}, data.getEvent, { comments: data.getEvent.comments.items })
        });
      });
  };
}

export function subscribeToEventComments(eventId) {
  return dispatch => {
    API.graphql(
      graphqlOperation(SubscribeToEventComments, { eventId })
    ).subscribe({
      next: response => {
        const data = response.value.data;
        // HACK: I'm not sure why all attributes are returned, but this filters out unwanted attributes
        const comment = pick(data.subscribeToEventComments, 'commentId', 'content', 'createdAt');
        dispatch({
          type: RECEIVED_EVENT_COMMENTS,
          eventId,
          comment
        });
      }
    });
  };
}

// TODO: how to unsubscribe??

export function createEvent(name, where, when, description) {
  return dispatch => {
    API.graphql(graphqlOperation(CreateEvent, { name, where, when, description }))
      .then(response => {
        dispatch({
          type: CREATE_EVENT_COMPLETE,
          event: response.data.createEvent
        });
      })
      .catch(error => {
        dispatch({
          type: CREATE_EVENT_FAILED,
          error
        });
      });
  };
}

export function commentOnEvent(eventId, content) {
  const createdAt = JSON.parse(JSON.stringify(new Date()));
  return dispatch => {
    API.graphql(graphqlOperation(CommentOnEvent, { eventId, content, createdAt }))
      .then(response => {
        const data = response.data;
        dispatch({
          type: COMMENT_ON_EVENT_COMPLETE,
          eventId,
          comment: data.commentOnEvent
        });
      })
      .catch(error => {
        dispatch({
          type: COMMENT_ON_EVENT_FAILED,
          error: error
        });
      });
  };
}
