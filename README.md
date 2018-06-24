# AppSync Demo

This example application demonstrates how to create a GraphQL endpoint with [AWS AppSync](https://aws.amazon.com/appsync/) that maps to your backend AWS services, like [DynamoDB](https://aws.amazon.com/dynamodb/), and uses [AWS Amplify](https://aws.github.io/aws-amplify/) in the client to securly interact with the services.

The client application is using [React](https://reactjs.org/) for views, [Redux](https://redux.js.org/) for state management, and [Twitter Bootstrap](https://getbootstrap.com/) for styles.

## Getting Started

This example is based on the sample schema provided by AWS when creating an AppSync GraphQL API in the console. But it also shows how to define and provision the entire stack with [AWS CloudFormation](https://aws.amazon.com/cloudformation/).

### Create a GraphQL API using sample schema

AppSync has an option to use a sample schema when creating a GraphQL API.  It provides a data model of Events and Comments, and includes type defintions, queries, mutations, subscriptions, data sources (DynamoDB tables), and resolvers.

1. Browse to AppSync in your AWS console
2. Click on “Create API”
3. Choose a name for your API and select the option “Sample schema”
4. Press “Create”

*Note: This will deploy an API, provision DynamoDB tables, and create IAM roles on your behalf.*

### Run Client App Locally

The client app is a Javascript application that uses [NPM](https://www.npmjs.com/) and [Webpack](https://webpack.js.org/), so it is easy to install dependencies and start a local server.

1. Edit [config.json](./config.json) and enter the GraphQL endpoint URL and API key from the previous step
2. Use npm to install dependencies and start the server
  ```bash
  npm install
  npm start
  ```
3. Connect to your app at [localhost:8080](http://localhost:8080)

### Provision Your Own GraphQL API with CloudFormation

Use aws-cli to provision the infrastructure via CloudFormation:

```bash
aws cloudformation package \
    --template-file ./infrastructure/master.yml \
    --s3-bucket <TEMPLATE_BUCKET_NAME> \
    --output-template-file master-template-output.yml

aws cloudformation deploy \
    --template-file ./master-template-output.yml \
    --capabilities CAPABILITY_IAM
    --stack-name appsync-demo \
    --parameter-overrides DomainName=appsync.cuperman.net ValidationDomainName=cuperman.net
```

### Deploy the Client App

1. Edit [config.json](./config.json) and enter the GraphQL endpoint URL and API key, if you haven't done so already
2. Use npm to build, and aws-cli to sync to S3
  ```bash
  npm run build
  aws s3 sync ./dist s3://<SITE_BUCKET_NAME>/ --acl public-read
  ```

## Resources

* [Introducing the AWS Amplify GraphQL Client](https://hackernoon.com/introducing-the-aws-amplify-graphql-client-8a1a1e514fde)
* [Deploy an AWS AppSync GraphQL API with CloudFormation](https://read.acloud.guru/deploy-an-aws-appsync-graphql-api-with-amazon-cloudformation-9a783fdd8491)

## More

Check out the users branch for a demonstration of authentication and authorization using [AWS Cognito](https://aws.amazon.com/cognito/).
