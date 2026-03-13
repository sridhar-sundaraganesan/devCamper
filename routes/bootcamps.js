const express = require('express')

//Incluse other resource Router
const courseRouter = require('./courses')

const router = express.Router()
const { getAllBootCamp, getBootCampByID, postBootCamp, putBootCamp, deleteBootCamp, getBootcampInRadius } = require('../controller/bootcamps')

//Re-Route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance')
  .get(getBootcampInRadius)

router.route('/')
  .get(getAllBootCamp)
  .post(postBootCamp)


router.route('/:id')
  .get(getBootCampByID)
  .put(putBootCamp)
  .delete(deleteBootCamp)


module.exports = router