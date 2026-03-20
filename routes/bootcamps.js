const express = require('express')

//Incluse other resource Router
const courseRouter = require('./courses')

const router = express.Router()
const { getAllBootCamp, getBootCampByID, postBootCamp, putBootCamp, deleteBootCamp, getBootcampInRadius } = require('../controller/bootcamps')
const { protect, authorize } = require('../middleware/auth')
//Re-Route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance')
  .get(getBootcampInRadius)

router.route('/')
  .get(getAllBootCamp)
  .post(protect, authorize('publisher', 'admin'), postBootCamp)


router.route('/:id')
  .get(getBootCampByID)
  .put(protect, authorize('publisher', 'admin'), putBootCamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootCamp)


module.exports = router