import users from './users'

export default function (app, mongoose) {
  app.use('/api/v1/user', users(mongoose))
}