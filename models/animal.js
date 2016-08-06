// Load required packages
var mongoose = require('mongoose');

// Define our animal schema
var AnimalSchema   = new mongoose.Schema({
  name: String,
  species: String,
  age: Number,
  owner: String
});

// Export the Mongoose model
module.exports = mongoose.model('Animal', AnimalSchema);