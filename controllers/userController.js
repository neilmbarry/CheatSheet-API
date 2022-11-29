const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      users,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new AppError('No user with that ID', 404));
    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    return next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      newUser,
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;
    console.log('UPDATE USER ID', userId);
    await User.findByIdAndUpdate(userId, req.body);
    res.status(200).json({
      status: 'success',
      message: 'User updated!',
    });
  } catch (err) {
    return next(err);
  }
};

exports.toggleFave = async (req, res, next) => {
  try {
    const { id } = req.user;

    const { cocktailId } = req.body;
    const user = await User.findById(id);
    console.log(user, 'INITAIL USER');

    if (!user) return next(new AppError('No user with that ID', 404));
    let favourites = user.faves;
    if (favourites.includes(cocktailId)) {
      favourites = favourites.filter(
        (faves) => faves.toString() !== cocktailId
      );
    } else {
      favourites = [...favourites, cocktailId];
    }

    // console.log(JSON.stringify({ faves: favourites }));
    const body = { faves: favourites };

    const updatedUser = await User.findByIdAndUpdate(id, body, {
      new: true,
    });
    console.log(updatedUser, 'UPDATED USER');
    // console.log(user);
    res.status(200).json({
      status: 'success',
      user: updatedUser,
    });
  } catch (err) {
    return next(err);
  }
};
exports.getFaves = async (req, res, next) => {
  console.log('GETTING FAVES');
  try {
    const { id } = req.user;
    console.log('ID---->', id);
    const user = await User.findById(id);
    if (!user) return next(new AppError('No user with that ID', 404));
    res.status(200).json({
      status: 'success',
      faves: user.faves,
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    return next(err);
  }
};

exports.getMe = async (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
