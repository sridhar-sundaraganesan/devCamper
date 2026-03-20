const express = require('express')
const router = express.Router()
const { register, login, getMe } = require('../controller/auth')
const { protect } = require('../middleware/auth')

router.route('/register')
  .post(register)

router.route('/login')
  .post(login)

router.route('/me')
  .get(protect, getMe)


module.exports = router