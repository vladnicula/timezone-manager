import express from 'express'
import User from '../../models/user'
import asyncRouteHandler from '../../utils/async-route-handler'
import bcrypt from 'bcrypt'

export default function (mongoose) {
  const userApi = express.Router()

  userApi.get('/user', asyncRouteHandler( 
    async (req, res) => {
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
  userApi.post('/user', asyncRouteHandler( 
    async (req, res) => {
      
      const { username, password } = req.body
      const passwordHash = bcrypt.hashSync(password, 10)

      // if(bcrypt.compareSync(password, passwordHash)) {
        
      // }

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
  userApi.patch('/user/:id', asyncRouteHandler( 
    async (req, res) => {

      const { username, password } = req.body

      const passwordHash = bcrypt.hashSync(password, 10)

      if ( bcrypt.compareSync(password, passwordHash ) ) {

        await User.findOneAndUpdate({username}, {
          username, password: bcrypt.hashSync(password, 10)
        })

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

  userApi.delete('/user/:id', asyncRouteHandler(
    (req, res) => {
      res.json({
        status: 'ok'
      })
    }
  ))

  return userApi
}