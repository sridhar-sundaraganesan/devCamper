const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');


//@Desc Get getAllCourses 
//@Route /api/v1/courses
//@Desc Get getAllCourseForSpeicificBootcamp
//@Route /api/v1/bootcamps/:bootcampId/courses
//@access PUBLIC
exports.getAllCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId })
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description email'
    })
  }
  const courses = await query
  res.status(200).json({ success: true, count: courses.length, data: courses })
})



//@Desc Get Single Course
//@Route api/v1/courses/:id
//@access PUBLIC 
exports.getCourseById = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  })
  if (!course) {
    return next(new ErrorResponse(`Course not found with the id of ${req.params.id}`, 404))
  }
  res.status(200).json({ success: true, data: course })
})


//@Desc POST Add a course
//@Route POST /api/v1/bootcamps/:bootcampId/courses
//@access PRIVATE
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  const bootcamp = Bootcamp.findById(req.params.bootcampId)
  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp found with the id of ${req.params.id}`))
  }
  const course = await Course.create(req.body)
  res.status(200).json({ success: true, data: course })
})


//@Desc Update each course
//@Route PUT /api/v1/courses
//@access PRIVATE
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

  if (!course) {
    return next(new ErrorResponse(`Course found with the id of ${req.params.id}`))
  }

  res.status(200).json({ success: true, data: course })
})


//@Desc delete a course
//@Route DELETE api/v1/courses/:id
//@access PRIVATE

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id)
  if (!course) {
    return next(new ErrorResponse(`Course not found with the id of ${req.params.id}`))
  }
  res.status(200).json({ success: true, data: `Data deleted` })
})