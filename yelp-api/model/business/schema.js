const mongoose = require('mongoose');
const ReviewSchema = require('../review/schema.js');
const CheckinSchema = require('../checkin/schema.js');
const Schema = mongoose.Schema


const Checkin = mongoose.model("checkins", CheckinSchema);
const Review = mongoose.model("reviews", ReviewSchema);

var businessSchema = new Schema({
  _id: String,
  full_address: String,
  active: String,
  categories: String,
  city: String,
  review_count: Number,
  business_name: String,
  neighborhoods: String,
  latitude: Number,
  longitude: Number,
  stars: Number,
  reviews: [Review.schema],
  checkins: [Checkin.schema]
});

module.exports = businessSchema;