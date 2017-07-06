import express from 'express'
import bodyParser from 'body-parser'

import apiRoutes from '../api'
import httpLogger from './http-logger'

export default async function serverSetup(config) {
  const {APP_PORT, APP_HOST} = config

  const app = express()

  app.use(bodyParser.json())

  httpLogger(app)

  apiRoutes(app)

  return Promise.resolve(app)
}