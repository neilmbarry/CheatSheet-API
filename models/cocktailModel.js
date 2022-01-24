const mongoose = require('mongoose');

const cocktailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  cocktailType: {
    type: String,
  },
  glassType: {
    type: String,
  },
  recipe: [
    {
      ingredient: String,
      quantity: Number,
      unit: String,
    },
  ],
  method: String,
  image: String,
  author: String,
  ratingsAverage: Number,
});

const Cocktail = mongoose.model('Cocktail', cocktailSchema);

module.exports = Cocktail;
