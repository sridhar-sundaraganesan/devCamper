const mongoose = require('mongoose')

const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI)
  console.log(`Mongodb connected: ${connection.connection.host}:${connection.connection.port}`.cyan.underline.bold);
}

module.exports = connectDB