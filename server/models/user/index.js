const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserModel =  mongoose.model('User', new Schema({

  username: {
    type: String,
    require: true
  },
  
  last_name: String,

  first_name: String,

  password: {
    type: String,
    require: true
  },
  role: {
    type: Number,
    defalut: 0,
    // 2- 'admin', 1 - 'manager', 0 - 'simple'
    enum: [0, 1, 2] 
  }
}))

export default UserModel