const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')


//@Desc Register USER
//@Route POST api/v1/auth/register
//@Access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  //Create a user
  const user = await User.create({
    name,
    email,
    password,
    role
  })

  sendTokenResponse(user, 200, res)
})


//@Desc Login USER
//@Route POST api/v1/auth/login
//@Access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorResponse(`Please enter email and password`, 400))
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401))
  }

  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401))
  }

  sendTokenResponse(user, 200, res)
})


//Send token,Cookie, and json response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  res.status(statusCode).cookie('token', token, options).json({ success: true, token })

}

