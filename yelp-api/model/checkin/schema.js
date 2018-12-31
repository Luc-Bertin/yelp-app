const mongoose = require('mongoose');
const Schema = mongoose.Schema

var checkinSchema = new Schema({
  day: String,
  hour: String,
  number_checkins: Number
});

module.exports = checkinSchema;