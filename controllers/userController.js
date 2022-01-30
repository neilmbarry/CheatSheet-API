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
  res.status(403).json({
    status: 'fail',
    message: 'This route is not yet defined.',
  });
};

exports.deleteUser = async (req, res, next) => {
  res.status(403).json({
    status: 'fail',
    message: 'This route is not yet defined.',
  });
};

exports.getMe = async (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
