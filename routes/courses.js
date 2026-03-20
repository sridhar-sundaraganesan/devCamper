const express = require('express')
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controller/courses')
const router = express.Router({ mergeParams: true })
const { protect, authorize } = require('../middleware/auth')

router.route('/')
  .get(getAllCourses)
  .post(protect, authorize('publisher', 'admin'), createCourse)

router.route('/:id')
  .get(getCourseById)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse)


module.exports = router