import express from 'express'

export default function (mongoose) {
  const userApi = express.Router()

  userApi.get('/', function (req, res) {
    res.send('List users')
  })

  return userApi
}