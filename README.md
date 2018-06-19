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

## GraphQL API with AppSync

Create a GraphQL API using AWS AppSync.

1. Browse to AppSync in your AWS console
2. Click on "Create API"
3. Choose a name for your API and select the option "Sample schema"
4. Press "Create"

*Note: This will deploy an API, provision DynamoDB tables, and create IAM roles on your behalf.*

### GraphQL Operations

#### Queries

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

# Fetch single event
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

#### Mutations

```graphql
# Create new event
#
mutation Event($name: String!, $where: String!, $when: String!, $description: String!) {
  createEvent(name: $name, where: $where, when: $when, description: $description) {
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

#### Subscriptions

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

## Schema Changes

I made one update to the sample schema to support my example application.

Add `scanIndexForward: false` to the resolver for event comments to retrieve comments in reverse order.

### GraphQL Integration

This is a good reference, and the examples are based on the sample schema:
[https://hackernoon.com/introducing-the-aws-amplify-graphql-client-8a1a1e514fde](https://hackernoon.com/introducing-the-aws-amplify-graphql-client-8a1a1e514fde)

In our app, all GraphQL operations are performed in the [actions](./app/actions.js). The actions are mapped to props and executed within the UI components. The actions perform the GraphQL operations asyncronously, and then dispatch the result, which is handled by the [reducer](./app/reducer.js). The reducer modifies the application state based on the response data, which triggers the components to re-render.

## UI with Amplify

### UI Dependencies

List dependencies and why they are being used (refer to package.json)

### Running the app locally

Edit [config.json](./config.json) and enter the credentials of your GraphQL API.

Use npm to install the dependencies and kick off any build task.

```bash
npm install # install dependencies
npm test    # run linter
npm start   # run webpack-dev-server
```

Connect to your app at [localhost:8080](http://localhost:8080)

## Provision with CloudFormation

Use aws-cli to deploy the infrastructure via CloudFormation:

```bash
aws cloudformation deploy \
    --template-file ./infrastructure/ui.yml \
    --stack-name appsync-demo-ui \
    --parameter-overrides DomainName=appsyncdemo.mydomain.com ValidationDomainName=mydomain.com

aws cloudformation deploy \
    --template-file ./infrastructure/storage.yml \
    --stack-name appsync-demo-storage \
    --capabilities CAPABILITY_IAM

aws cloudformation deploy \
    --template-file ./infrastructure/api.yml \
    --stack-name appsync-demo-api \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides DataAccessPolicyArn=POLICY_ARN EventsTableName=TABLE_NAME CommentsTableName=TABLE_NAME
```

Update config.json, then build & deploy the site:

```bash
npm run build
aws s3 sync ./public s3://appsync-demo-ui-sitebucket-ID/ --acl public-read
```

## Resources

* [Introducing the AWS Amplify GraphQL Client](https://hackernoon.com/introducing-the-aws-amplify-graphql-client-8a1a1e514fde)
* [Deploy an AWS AppSync GraphQL API with CloudFormation](https://read.acloud.guru/deploy-an-aws-appsync-graphql-api-with-amazon-cloudformation-9a783fdd8491)

## TODO

- [x] Use Amplify GraphQL Client with React/Redux
- [x] Use subscriptions to listen for data updates
- [x] Integration with Cognito
- [x] Deploy with CloudFormation
- [ ] Cognito User Pool Authorizations
- [ ] Offline support
- [ ] Server-side rendering
