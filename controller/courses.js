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
  req.body.user = req.user.id
  const bootcamp = await Bootcamp.findById(req.params.bootcampId)
  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp found with the id of ${req.params.id}`))
  }

  //Make sure the user is bootcamp owner

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ID ${req.user.id} is not authorized to access this bootcamp ${bootcamp.id}`, 401))
  }

  const course = await Course.create(req.body)
  res.status(200).json({ success: true, data: course })
})


//@Desc Update each course
//@Route PUT /api/v1/courses
//@access PRIVATE
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id)

  if (!course) {
    return next(new ErrorResponse(`Course found with the id of ${req.params.id}`))
  }

  //Make sure the user is owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course`, 401))
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  res.status(200).json({ success: true, data: course })
})


//@Desc delete a course
//@Route DELETE api/v1/courses/:id
//@access PRIVATE

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
  if (!course) {
    return next(new ErrorResponse(`Course not found with the id of ${req.params.id}`, 404))
  }

  //Make sure the user is owner of the bootcamp
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this course`, 401))
  }


  res.status(200).json({ success: true, data: `Data deleted` })
})