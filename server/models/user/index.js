const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserModel =  mongoose.model('User', new Schema({ 
  name: String, 
  password: String,
  role: {
    type: String,
    enum: ['admin', 'manager', 'simple'] 
  }
}))

export default UserModel