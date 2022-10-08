const Cocktail = require('../models/cocktailModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCocktails = async (req, res, next) => {
  try {
    // ------ FIND COCKTAILS WITH JUST ALL OF THESE INGS (VERY JANKY) ------//
    // const pipeline = req.query.ingredient.split(',').map((ing) => ({
    //   $match: {
    //     'recipe.ingredient': ing,
    //   },
    // }));
    // const cocktailsByIng = await Cocktail.aggregate([...pipeline]);
    ////////////////////////////////////////////////////////////////////
    // ------ FIND COCKTAILS WITH JUST ONE OF THESE INGS ------//
    // const cocktails = await Cocktail.find({
    //   'recipe.ingredient': {
    //     $in: req.query.ingredient.split(','),
    //   },
    // });
    ////////////////////////////////////////////////////////////////////

    const features = new APIFeatures(Cocktail.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const cocktails = await features.query;

    res.status(200).json({
      status: 'success',
      // AggregateCocktails_results: cocktailsByIng.length,
      results: cocktails.length,
      // AggregateCocktails: cocktailsByIng,
      cocktails,
    });
  } catch (err) {
    return next(err);
  }
};

exports.createCocktail = async (req, res, next) => {
  console.log(req.body, '<--- create cocktail');
  try {
    const newCocktail = await Cocktail.create({
      name: req.body.name,
      author: req.body.author,
      flavour: req.body.flavour,
      glass: req.body.glass,
      recipe: req.body.recipe,
      ingredients: req.body.ingredients,
      image: req.body.image,
      garnish: req.body.garnish,

      user: req.user.id,
    });

    res.status(200).json({
      status: 'success',
      message: 'Added cocktail',
      data: newCocktail,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getCocktail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cocktail = await Cocktail.findById(id);
    if (!cocktail) {
      return next(new AppError('Could not find cocktail with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      message: 'Got cocktail',
      data: cocktail,
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateCocktail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cocktail = await Cocktail.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cocktail) {
      return next(new AppError("Couldn't find cocktail with that ID", 404));
    }
    res.status(200).json({
      status: 'success',
      message: 'Updated cocktail',
      data: cocktail,
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteCocktail = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Cocktail.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      message: 'Deleted cocktail',
    });
  } catch (err) {
    return next(err);
  }
};
