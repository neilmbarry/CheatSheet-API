const Cocktail = require('../models/cocktailModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCocktails = async (req, res, next) => {
  try {
    const features = new APIFeatures(Cocktail.find(), req.query)
      .filter()
      .sort()
      .limitFields();

    const allMatchingCocktails = await features.query;

    const featuresPaginated = new APIFeatures(Cocktail.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const cocktails = await featuresPaginated.query;
    res.status(200).json({
      status: 'success',
      page: +req.query.page,
      searchTerm: req.query.nameSearch,
      results: allMatchingCocktails.length,
      cocktails,
    });
  } catch (err) {
    return next(err);
  }
};

exports.createCocktail = async (req, res, next) => {
  try {
    const newCocktail = await Cocktail.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(200).json({
      status: 'success',
      message: 'Your cocktail has been added!',
      newCocktail,
    });
  } catch (err) {
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
      message: 'Got cocktail!',
      cocktail,
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
      message: 'Your cocktail was updated!',
      updatedCocktail: cocktail,
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
      deletedCocktail: true,
    });
  } catch (err) {
    return next(err);
  }
};

exports.randomCocktail = async (req, res, next) => {
  try {
    const cocktails = await Cocktail.find();
    const cocktailsLength = cocktails.length;
    const randomIndex = Math.floor(Math.random() * cocktailsLength);
    const randomCocktail = await cocktails[randomIndex].populate('reviews');
    res.status(200).json({
      status: 'success',
      message: 'A random cocktail just for you!',
      cocktail: randomCocktail,
    });
  } catch (err) {
    return next(err);
  }
};
