const express = require('express')
const dotenv = require('dotenv')
const app = express()
const bootcampRoute = require('./routes/bootcamps')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')
const errorHandler = require('./middleware/error')
const qs = require('qs')
//Body parser

app.use(express.json())

app.set('query parser', str => qs.parse(str))

dotenv.config({ path: `./config/config.env` })
const PORT = process.env.PORT || 5000

//Type of method, host, url from postman
if (process.env.NODE_ENV === 'development') {
  app.use(morgan())
}

//Connection to DB
connectDB()

app.use('/api/v1/bootcamps', bootcampRoute)

app.use(errorHandler)

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold))

//handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  //Exit the running app and make it crash
  server.close(() => process.exit(1))
})

