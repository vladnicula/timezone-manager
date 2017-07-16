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

- Go to the location indicated by the web server log after setup is done.