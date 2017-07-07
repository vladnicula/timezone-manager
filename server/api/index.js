import users from './users'
import error from './error'

export default function(app, mongoose) {
  app.use('/api/v1/', users(mongoose))
  app.use(error)
}
