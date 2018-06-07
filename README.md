# AppSync Demo

[AWS AppSync](https://aws.amazon.com/appsync/) allows you to define a GraphQL endpoint that maps to backend datastores, like [DynamoDB](https://aws.amazon.com/dynamodb/). This fits in nicely with modern client-side applications stacks. [AWS Amplify](https://aws.github.io/aws-amplify/) provides a JavaScript interface for common client-side tasks, like authentication and secure API requests.

This demo app uses React for views, Redux for state management, GraphQL for communication to backend, and DynamoDB as a central datastore.

<img src="https://cdn.worldvectorlogo.com/logos/react.svg"
     alt="React"
     width="150px" />&nbsp;<img
     src="https://cdn.worldvectorlogo.com/logos/redux.svg"
     alt="Redux"
     width="130px" />&nbsp;&nbsp;&nbsp;<img
     src="https://cdn.worldvectorlogo.com/logos/graphql.svg"
     alt="GraphQL"
     width="110px" />&nbsp;&nbsp;&nbsp;<img
     src="https://cdn.worldvectorlogo.com/logos/aws-dynamodb.svg"
     alt="DynamoDB"
     width="105px" />

## GraphQL API

Create a GraphQL API using AWS AppSync.

1. Browse to AppSync in your AWS console
2. Click on "Create API"
3. Choose a name for your API and select the option "Sample schema"
4. Press "Create"

*Note: This will deploy an API, provision DynamoDB tables, and create IAM roles on your behalf.*

## GraphQL Operations

### Queries

```graphql
# Fetch all events
#
query EventConnection {
  listEvents {
    items {
      id
      name
      where
      when
      description
    }
  }
}

## Fetch single event
#
query Event($id: ID!) {
  getEvent(id: $id) {
    id
    name
    where
    when
    description
    comments {
      items {
        eventId
        commentId
        content
        createdAt
      }
    }
  }
}
```

### Mutations

```graphql
# Create new event
#
mutation Event($name: String!, $when: String!, $where: String!, $description: String!) {
  createEvent(name: $name, when: $when, where: $where, description: $description) {
    id
    name
    where
    when
    description
  }
}

# Comment on event
#
mutation Comment($eventId: ID!, $content: String!, $createdAt: String!) {
  commentOnEvent(eventId: $eventId, content: $content, createdAt: $createdAt) {
    eventId
    commentId
    content
    createdAt
  }
}

# deleteEvent
#
mutation Event($id: ID!) {
  deleteEvent(id: $id)
}
```

### Subscriptions

```graphql

# Subscribe to comments on event
#
subscription Comment($eventId: String!) {
  subscribeToEventComments(eventId: $eventId) {
    eventId
    commentId
    content
    createdAt
  }
}
```

## UI Dependencies

List dependencies and why they are being used (refer to package.json)

## TODO

- [x] Use Amplify GraphQL Client with React/Redux
- [x] Use subscriptions to listen for data updates
- [ ] Server-side rendering
- [ ] Integration with Cognito
- [ ] Deploy with CloudFormation
- [ ] Offline support
