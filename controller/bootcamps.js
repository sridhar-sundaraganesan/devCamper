const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocode')

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access PUBLIC
exports.getAllBootCamp = asyncHandler(async (req, res, next) => {
  let queryObj = { ...req.query }

  const removeFields = ['select', 'sort', 'limit', 'page']
  removeFields.forEach(param => delete queryObj[param])

  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
  queryObj = JSON.parse(queryStr)
  let query = Bootcamp.find(queryObj).populate('courses')

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  //Adding pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)
  let pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  const bootcamps = await query
  res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps })
})


//@desc get bootcamp by id
//@route GET /api/v1/bootcamps/:id
//@access PUBLIC
exports.getBootCampByID = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }
  res.status(200).json({ success: true, data: bootcamp })
})

//@desc create bootcamp
//@route POST/api/v1/bootcamps
//access PRIVATE
exports.postBootCamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id

  //Check if published bootcamps
  const publishedBootcamps = await Bootcamp.findOne({ user: req.user.id })

  if (publishedBootcamps && req.user.role === 'publisher') {
    return next(new ErrorResponse(`The user with Id ${req.user.id} already published a bootcamp`, 400))
  }

  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({ success: true, data: bootcamp })
})

//@desc update bootcamp
//@route PUT/api/v1/bootcamp/:id
//@access PRIVATE
exports.putBootCamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }

  //Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`, 401))
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  res.status(200).json({ success: true, data: bootcamp })
})


//@desc delete bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access PRIVATE 
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 401))
  }

  //Make sure the user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this bootcamp`))
  }

  bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

  res.status(200).json({ success: true, data: 'Data deleted' })
})


//@Desc get bootcamps within a radius
//@route GET /api/bootcamp/:radius/:zipcode/:distance
//access PUBLIC 
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  //Latitude and longitude
  const loc = await geocoder.geocode(zipcode);
  const usResult = loc.find(l => l.countryCode === 'US');
  const lng = usResult.longitude;
  const lat = usResult.latitude;

  //Calculate radius using radians
  const radius = distance / 3963

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius]
      }
    }
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })
})
