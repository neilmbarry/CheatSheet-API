const mongoose = require('mongoose');
const slugify = require('slugify');

const cocktailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A cocktail must have a name.'],
    trim: true,
    unique: true,
    maxLength: [40, 'A cocktail name must not exceed 40 characters.'],
  },
  slug: {
    type: String,
  },
  cocktailType: {
    type: String,
    required: [true, 'A cocktail must have a type.'],
    enum: {
      values: [
        'Spirit Forward',
        'Citrus Forward',
        'Collins',
        'Mule',
        'Sour',
        'Other',
      ],
      message: 'A cocktail must be a certain type of cocktail.',
    },
  },
  glassType: {
    type: String,
    required: [true, 'A cocktail must have a recommended glass.'],
    enum: {
      values: ['Rocks', 'Coupe', 'Tall', 'Flute', 'Other'],
      message: 'A cocktail must have a certain glass type.',
    },
  },
  recipe: {
    type: [
      {
        ingredient: {
          type: String,
          required: [true, 'An ingredient must have a name.'],
        },
        brand: String,
        quantity: {
          type: Number,
          required: [true, 'An ingredient must have a quantity.'],
        },
        unit: {
          type: String,
          required: [true, 'An ingredient must have a unit.'],
          enum: {
            values: ['oz', 'ml', 'dash', 'pinch', 'whole', 'other'],
            message:
              'A unit must be one of the following: {oz}, {ml}, {dash}, {pinch}, {other}.',
          },
        },
      },
    ],
    validate: {
      validator: function (val) {
        return val.length > 0;
      },
      message: 'A cocktail recipe must have at least one ingredient',
    },
    required: [true, 'A cocktail recipe must have at least one ingredient'],
  },
  garnish: String,
  method: String,
  image: String,
  author: String,
  ratingsQuantity: Number,
  ratingsAverage: Number,
});

cocktailSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  // this.recipe.forEach(function (ing) {
  //   return (ing.slug = slugify(ing.ingredient, {
  //     lower: true,
  //   }));
  // });
  next();
});

const Cocktail = mongoose.model('Cocktail', cocktailSchema);

module.exports = Cocktail;
