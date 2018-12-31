const mongoose = require('mongoose');
const Schema = mongoose.Schema

var reviewSchema = new Schema({
  review_id: String,
  business_id: String,
  user_id: String,
  stars: Number,
  review_date: { type: Date, default: Date.now },
  votes_funny: Number,
  votes_useful: Number,
  votes_cool: Number,
  review_text: String
});

module.exports = reviewSchema;