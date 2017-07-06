import express from 'express'
import bodyParser from 'body-parser'

import apiRoutes from '../api'

export default async function serverSetup(config) {
  const {APP_PORT, APP_HOST} = config

  const app = express()

  app.use(bodyParser.json())

  apiRoutes(app)

  return Promise.resolve(app)
}