import express from 'express'
import User from '../../models/user'
import asyncRouteHandler from '../../utils/async-route-handler'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import requireLogin from '../../middleware/require-login'

export default function(mongoose) {
  const userApi = express.Router()

  userApi.get(
    '/user',
    requireLogin,
    asyncRouteHandler(async (req, res) => {
      const users = await User.find({})
      res.json({
        users,
        status: 'ok'
      })
    })
  )

  /**
   * Create a user
   */
  userApi.post(
    '/user',
    asyncRouteHandler(async (req, res) => {
      const { username, password } = req.body
      const passwordHash = bcrypt.hashSync(password, 10)

      const user = await User.create({
        username,
        password: passwordHash
      })

      res.json({
        status: 'ok'
      })
    })
  )

  /*
   * Update existing user
   */
  userApi.patch(
    '/user/:id',
    asyncRouteHandler(async (req, res) => {
      const { username, password } = req.body

      const passwordHash = bcrypt.hashSync(password, 10)

      if (bcrypt.compareSync(password, passwordHash)) {
        await User.findOneAndUpdate(
          { username },
          {
            username,
            password: bcrypt.hashSync(password, 10)
          }
        )

        res.json({
          user: {
            username
          },
          status: 'ok'
        })
      } else {
        res.status(400).json({
          status: 'error',
          message: 'user authorisation failed'
        })
      }
    })
  )

  userApi.delete(
    '/user/:id',
    asyncRouteHandler((req, res) => {
      res.json({
        status: 'ok'
      })
    })
  )

  userApi.post(
    '/user/authenticate',
    asyncRouteHandler(async (req, res) => {
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(403).json({
          status: 'error',
          message: 'empty user credentials'
        })
      }

      const matchedUser = await User.findOne({
        username: username
      })

      if (!matchedUser) {
        return res.status(401).json({
          status: 'error',
          message: 'invalid user credentials'
        })
      }

      if (!bcrypt.compareSync(password, matchedUser.password)) {
        return res.status(401).json({
          status: 'error',
          message: 'invalid user password'
        })
      }

      const authToken = jwt.sign(
        matchedUser.toJSON(),
        req.app.get('JWT_SECRET'),
        {
          expiresIn: 24 * 60 * 60 // 24 hours token lifespan
        }
      )

      res.json({
        status: 'ok',
        token: authToken
      })
    })
  )

  return userApi
}
