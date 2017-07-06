import express from 'express'
import User from '../../models/user'
import asyncRouteHandler from '../../utils/async-route-handler'

export default function (mongoose) {
  const userApi = express.Router()

  userApi.get('/', asyncRouteHandler( 
    async (req, res) => {
      const users = await User.find({})
      res.json({
        users,
        status: 'ok'
      })
    })
  )

  return userApi
}