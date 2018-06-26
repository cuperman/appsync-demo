import { API, graphqlOperation } from 'aws-amplify';

// Action Types

export const FETCH_EVENTS_COMPLETE              = 'FETCH_EVENTS_COMPLETE';
export const FETCH_MORE_EVENTS_COMPLETE         = 'FETCH_MORE_EVENTS_COMPLETE';
export const FETCH_EVENT_COMMENTS_COMPLETE      = 'FETCH_EVENT_COMMENTS_COMPLETE';
export const FETCH_MORE_EVENT_COMMENTS_COMPLETE = 'FETCH_MORE_EVENT_COMMENTS_COMPLETE';
export const RECEIVED_EVENT_COMMENT             = 'RECEIVED_EVENT_COMMENT';
export const CREATE_EVENT_FAILED                = 'CREATE_EVENT_FAILED';
export const CREATE_EVENT_COMPLETE              = 'CREATE_EVENT_COMPLETE';
export const COMMENT_ON_EVENT_FAILED            = 'COMMENT_ON_EVENT_FAILED';
export const COMMENT_ON_EVENT_COMPLETE          = 'COMMENT_ON_EVENT_COMPLETE';

// GraphQL Queries

const FetchEvents = `query EventConnection($nextToken: String) {
  listEvents(nextToken: $nextToken) {
    items {
      id
      name
      where
      when
      description
      owner
    }
    nextToken
  }
}`;

const FetchEventComments = `query Event($id: ID!, $nextToken: String) {
  getEvent(id: $id) {
    id
    comments(limit: 10, nextToken: $nextToken) {
      items {
        eventId
        commentId
        content
        createdAt
        user
      }
      nextToken
    }
  }
}`;

const SubscribeToEventComments = `subscription Comment($eventId: String!) {
  subscribeToEventComments(eventId: $eventId) {
    eventId
    commentId
    content
    createdAt
    user
  }
}`;

const CreateEvent = `mutation Event($name: String!, $where: String!, $when: String!, $description: String!, $owner: String) {
  createEvent(name: $name, where: $where, when: $when, description: $description, owner: $owner) {
    id
    name
    where
    when
    description
    owner
  }
}`;

const CommentOnEvent = `mutation Comment($eventId: ID!, $content: String!, $createdAt: String!, $user: String) {
  commentOnEvent(eventId: $eventId, content: $content, createdAt: $createdAt, user: $user) {
    eventId
    commentId
    content
    createdAt
    user
  }
}`;

// Exported Actions

export function fetchEvents(nextToken) {
  return dispatch => {
    API.graphql(graphqlOperation(FetchEvents, { nextToken }))
      .then(response => {
        const data = response.data;

        dispatch({
          type: nextToken ? FETCH_MORE_EVENTS_COMPLETE : FETCH_EVENTS_COMPLETE,
          events: data.listEvents.items,
          nextToken: data.listEvents.nextToken
        });
      });
  };
}

export function fetchEventComments(eventId, nextToken) {
  return dispatch => {
    API.graphql(graphqlOperation(FetchEventComments, { id: eventId, nextToken }))
      .then(response => {
        const data = response.data;
        dispatch({
          type: nextToken ? FETCH_MORE_EVENT_COMMENTS_COMPLETE : FETCH_EVENT_COMMENTS_COMPLETE,
          eventId: data.getEvent.id,
          comments: data.getEvent.comments.items,
          nextToken: data.getEvent.comments.nextToken
        });
      });
  };
}

const eventCommentSubscriptions = {};

export function subscribeToEventComments(eventId) {
  return dispatch => {
    const subscription = API.graphql(
      graphqlOperation(SubscribeToEventComments, { eventId })
    ).subscribe({
      next: response => {
        const data = response.value.data;
        dispatch({
          type: RECEIVED_EVENT_COMMENT,
          eventId,
          comment: data.subscribeToEventComments
        });
      }
    });

    eventCommentSubscriptions[eventId] = eventCommentSubscriptions[eventId] || [];
    eventCommentSubscriptions[eventId].push(subscription);
  };
}

export function unsubscribeFromEventComments(eventId) {
  if (eventCommentSubscriptions[eventId]) {
    eventCommentSubscriptions[eventId].forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}

export function createEvent(name, where, when, description, owner) {
  return dispatch => {
    API.graphql(graphqlOperation(CreateEvent, { name, where, when, description, owner }))
      .then(response => {
        dispatch({
          type: CREATE_EVENT_COMPLETE,
          event: response.data.createEvent
        });

        fetchEvents()(dispatch);
      })
      .catch(error => {
        dispatch({
          type: CREATE_EVENT_FAILED,
          error
        });
      });
  };
}

export function commentOnEvent(eventId, content, user) {
  const createdAt = JSON.parse(JSON.stringify(new Date()));
  return dispatch => {
    API.graphql(graphqlOperation(CommentOnEvent, { eventId, content, createdAt, user }))
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
