const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: [true, 'Please add course title'] },
  description: { type: String, required: [true, 'Please add course description'] },
  weeks: { type: Number, required: [true, 'Please add course weeks'] },
  tuition: { type: Number, required: [true, 'Please enter cost of the course'] },
  minimumSkill: { type: String, required: [true, 'Please enter minimum skill'], enum: ['beginner', 'intermediate', 'advanced'] },
  scholarshipAvailable: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  bootcamp: { type: mongoose.Schema.ObjectId, ref: 'Bootcamp', required: true }
})

module.exports = mongoose.model('Course', courseSchema)