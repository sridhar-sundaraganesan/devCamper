const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add name'] },
  email: { type: String, required: [true, 'Please add a email'], unique: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] },
  role: { type: String, enum: ['user', 'publisher'], default: 'user' },
  password: { type: String, select: false, minLength: 6, required: [true, 'Please add password'] },
  resetPassword: String,
  resetPasswordExpiresIn: Date,
  createdAt: { type: Date, default: Date.now }
})

//encrypt a password using bcrypt
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

//generate a token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}


//Match users password with hased password in DB using bcrypt.compare()

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}




module.exports = mongoose.model('User', userSchema)