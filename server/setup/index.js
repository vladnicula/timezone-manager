import express from 'express'
import bodyParser from 'body-parser'

import apiRoutes from '../api'
import httpLogger from './http-logger'
import mongoConnection from './mongo-connection'

export default async function serverSetup(config) {
  const {APP_PORT, APP_HOST, MONGO_DB_CON_STRING} = config

  let mongoose
  const databaseName = process.env.NODE_ENV === 'production' ? 'timezone-manager-prod' : 'timezone-manager-dev' 
  try {
    mongoose = await mongoConnection(MONGO_DB_CON_STRING, databaseName)    
  } catch (err) {
    console.log('Error opening mongo connection\n', err)
    process.exit(1)
  }

  const app = express()

  app.use(bodyParser.json())

  httpLogger(app)

  apiRoutes(app, mongoose)

  return Promise.resolve(app)
}