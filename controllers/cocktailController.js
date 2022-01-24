const Cocktail = require('../models/cocktailModel');

console.log(Cocktail, 'this is Cocktail');

exports.getAllCocktails = async (req, res, next) => {
  try {
    const cocktails = await Cocktail.find({});
    res.status(200).json({
      status: 'success',
      message: 'Got all cocktails',
      data: cocktails,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createCocktail = async (req, res, next) => {
  const newCocktail = req.body;
  await Cocktail.create(newCocktail);
  res.status(200).json({
    status: 'success',
    message: 'Added cocktail',
    data: newCocktail,
  });
};

exports.getCocktail = async (req, res, next) => {
  const { id } = req.params;
  const cocktail = await Cocktail.findById(id);
  res.status(200).json({
    status: 'success',
    message: 'Got cocktail',
    data: cocktail,
  });
};

exports.updateCocktail = async (req, res, next) => {
  const { id } = req.params;
  const cocktail = await Cocktail.findByIdAndUpdate(id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Updated cocktail',
    data: cocktail,
  });
};

exports.deleteCocktail = async (req, res, next) => {
  const { id } = req.params;
  await Cocktail.findByIdAndDelete(id);
  res.status(204).json({
    status: 'success',
    message: 'Deleted cocktail',
  });
};
