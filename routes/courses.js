const express = require('express')
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controller/courses')
const router = express.Router({ mergeParams: true })


router.route('/')
  .get(getAllCourses)
  .post(createCourse)

router.route('/:id')
  .get(getCourseById)
  .put(updateCourse)
  .delete(deleteCourse)


module.exports = router