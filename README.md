# appsync-demo

## GraphQL Queries

**Fetch all events**

```graphql
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
```

**Fetch single event**

```graphql
query Event($id: ID!) {
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
}
```

## GraphQL Mutations

**Create new event**

```graphql
mutation Event($name: String!, $when: String!, $where: String!, $description: String!) {
  createEvent(name: $name, when: $when, where: $where, description: $description) {
    id
    name
    where
    when
    description
  }
}
```

**Comment on event**

```graphql
mutation Comment($eventId: ID!, $content: String!, $createdAt: String!) {
  commentOnEvent(eventId: $eventId, content: $content, createdAt: $createdAt) {
    eventId
    commentId
    content
    createdAt
  }
}
```

**deleteEvent**

```graphql
mutation Event($id: ID!) {
  deleteEvent(id: $id)
}
```

## GraphQL Subscriptions

```graphql
subscription Comment($eventId: String!) {
  subscribeToEventComments(eventId: $eventId) {
    commentId
    content
    createdAt
  }
}
```

## UI Dependencies

List dependencies and why they are being used (refer to package.json)

## TODO

[x] Use Amplify GraphQL Client with React/Redux
[x] Use subscriptions to listen for data updates
[ ] Server-side rendering
[ ] Integration with Cognito
[ ] Deploy with CloudFormation
[ ] Offline support
