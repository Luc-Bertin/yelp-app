const mongoose = require('mongoose');
const ReviewSchema = require('../review/schema.js');
const Schema = mongoose.Schema

const Review = mongoose.model("reviews", ReviewSchema);

var userSchema = new Schema({
    _id: String,
    votes_funny: Number,
    votes_useful: Number,
    votes_cool: Number,
    name: String,
    average_stars: Number,
    review_count: Number,
	reviews: [Review.schema]
});

module.exports = userSchema;