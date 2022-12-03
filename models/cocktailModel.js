const mongoose = require('mongoose');
const slugify = require('slugify');

const cocktailSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A cocktail must have a name.'],
      trim: true,
      unique: true,
      maxLength: [20, 'A cocktail name must not exceed 20 characters.'],
    },
    slug: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A cocktail must by created by a user.'],
    },
    glass: {
      type: String,
      trim: true,
      required: [true, 'A cocktail must have a recommended glass.'],
      enum: {
        values: ['Rocks', 'Coupe', 'Tall', 'Flute', 'Other', 'Short', 'Rocks'],
        message: 'A cocktail must have a certain glass type.',
      },
    },
    flavour: {
      type: String,
      required: [true, 'A cocktail must have a type.'],
      enum: {
        values: [
          'Boozy',
          'Citrusy',
          'Collins',
          'Mule',
          'Sour',
          'Other',
          'Sweet',
          'Bitter',
          'Spicy',
        ],
        message: 'A cocktail must be a certain type of cocktail.',
      },
    },
    garnish: String,
    ingredients: {
      type: [
        {
          name: {
            type: String,
            trim: true,
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
              values: ['Oz', 'Ml', 'Dash', 'pinch', 'whole', 'other'],
              message:
                'A unit must be one of the following: {Oz}, {Ml}, {Dash}, {pinch}, {other}.',
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
    method: {
      type: [
        {
          value: {
            type: String,
            required: [true, 'An step must have some text.'],
          },
        },
      ],
      validate: {
        validator: function (val) {
          return val.length > 0;
        },
        message: 'A cocktail recipe must have at least one step',
      },
      required: [true, 'A cocktail recipe must have at least one step'],
    },
    image: String,
    author: String,
    ratingsQuantity: Number,
    ratingsAverage: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// cocktailSchema.virtual('durationWeeks').get(() => 6);

cocktailSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'cocktail',
  localField: '_id',
});

// cocktailSchema.pre(/^find/, async function (next) {
//   console.log('hangin on pre find cocktail schema');
//   this.populate({
//     path: 'reviews',
//     select: 'name rating summary createdAt -cocktail',
//   });
//   next();
// });

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
