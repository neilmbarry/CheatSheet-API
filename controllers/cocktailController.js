const Cocktail = require('../models/cocktailModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCocktails = async (req, res, next) => {
  try {
    // console.log(req.query);

    const features = new APIFeatures(Cocktail.find(), req.query)
      .filter()
      .sort()
      .limitFields();
    // .paginate();

    // console.log(features.query);

    const allMatchingCocktails = await features.query;

    const featuresPaginated = new APIFeatures(Cocktail.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const cocktails = await featuresPaginated.query;
    console.log('Hello from the getAllCocktail! 🙋‍♂️');
    res.status(200).json({
      status: 'success',
      // AggregateCocktails_results: cocktailsByIng.length,
      page: +req.query.page,
      searchTerm: req.query.nameSearch,
      results: allMatchingCocktails.length,
      // AggregateCocktails: cocktailsByIng,
      cocktails,
    });
  } catch (err) {
    return next(err);
  }
};

exports.createCocktail = async (req, res, next) => {
  // console.log(req.body, '<--- create cocktail');
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
    // console.log(err, '<<<<<<<<<< error createcocktail');
    return next(err);
  }
};

exports.getCocktail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const cocktail = await Cocktail.findOne({ slug }).populate('reviews');
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
    const { slug } = req.params;
    const cocktail = await Cocktail.findOneAndUpdate({ slug }, req.body, {
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
    const { slug } = req.params;
    await Cocktail.findOneAndDelete({ slug });
    res.status(204).json({
      status: 'success',
      message: 'Deleted cocktail',
    });
  } catch (err) {
    return next(err);
  }
};
