#Timezone Manager

#Tech stack
- node 6.x
- npm or yarn for running tasks
- server side routing and main handling via express 4.x
- restfull auth via jwt (jsonwebtoken)
- frontend with react + redux
- frontend build system via webpack 2.x + babel 

Will asume usage of yarn not npm from now on.

#Environment setup

## Required technologies
- mongo v3.14
- node 6.x 
- yarn latest

## Server startup
- Start mongo and make sure it is running properly

- Assure that `timezone-manager-dev` and `timezone-manager-test` are 
available databases. An alternative is to configure default.js and test.js in
the config folder to point to the desired databases.

- Start api server via `yarn start-api-server-[dev|test]` depending on desired environment

- Start web server via `yarn start-web-server-[dev|test]` depending on desired environment

- Run tests for the api server with `yarn test` (client side test were not included due
to lack of time for this project...)

- Go to the location indicated by the web server log after setup is done.

# Overall architecture

We have two separate applications. One is a REST API whith JSON WEB TOKEN authentication
functionality that allows CRUD operations for two entity types, the users and the timezone
records. The other one is a React Application that is served by a minimal node js server. 

The REST API is independent of the client application. It runs as its own process and
only handles backend operations. All functionality is supported by the API alone. 

The React App runs as a single page web application and recives a configuration url
to the REST API. We can run the React App without the API or with a mock API if needed.