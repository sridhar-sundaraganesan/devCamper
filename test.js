// test.js
const geocoder = require('./utils/geocode');

async function run() {
  try {
    const res = await geocoder.geocode('Madurai South TN India');
    console.log("Latitude:", res[0].latitude);
    console.log("Longitude:", res[0].longitude);
    console.log("Formatted Address:", res[0].formattedAddress);
  } catch (err) {
    console.error(err);
  }
}

run();
