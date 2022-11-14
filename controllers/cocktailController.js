const Cocktail = require('../models/cocktailModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCocktails = async (req, res, next) => {
  try {
    console.log(req.query);

    const features = new APIFeatures(Cocktail.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // console.log(features.query);

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
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(200).json({
      status: 'success',
      message: 'Added cocktail',
      data: newCocktail,
    });
  } catch (err) {
    console.log(err, '<<<<<<<<<<');
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
