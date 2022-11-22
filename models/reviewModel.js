const mongoose = require('mongoose');
const Cocktail = require('./cocktailModel');

const reviewSchema = mongoose.Schema({
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: [true, 'A review must have a rating.'],
  },
  summary: {
    type: String,
    maxlength: [800, 'A review must have no more than 800 characters.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A review must have an user.'],
  },
  cocktail: {
    type: mongoose.Schema.ObjectId,
    ref: 'Cocktail',
    required: [true, 'A review must reference a cocktail.'],
  },
});

reviewSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
});

reviewSchema.statics.calcAverages = async function (cocktailId) {
  const stats = await this.aggregate([
    {
      $match: { cocktail: cocktailId },
    },
    {
      $group: {
        _id: '$cocktail',
        ratingsQuantity: { $sum: 1 },
        ratingsAverage: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  if (stats) {
    await Cocktail.findByIdAndUpdate(cocktailId, {
      ratingsQuantity: stats[0].ratingsQuantity,
      ratingsAverage: stats[0].ratingsAverage,
    });
  } else {
    await Cocktail.findByIdAndUpdate(cocktailId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverages(this.cocktail);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
