const NodeGeocoder = require('node-geocoder')

const options = {
  provider: 'openstreetmap',
  language: 'en',
  email: 'sridharsundaraganesan@gmail.com',
  osmServer: 'https://nominatim.openstreetmap.org',
  userAgent: 'devcamper-app'
}


const geocoder = NodeGeocoder(options)

module.exports = geocoder
