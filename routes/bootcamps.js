const express = require('express')
const router = express.Router()
const { getAllBootCamp, getBootCampByID, postBootCamp, putBootCamp, deleteBootCamp } = require('../controller/bootcamps')

router.route('/')
  .get(getAllBootCamp)
  .post(postBootCamp)

router.route('/:id')
  .get(getBootCampByID)
  .put(putBootCamp)
  .delete(deleteBootCamp)


module.exports = router