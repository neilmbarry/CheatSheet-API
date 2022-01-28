const User = require('../models/userModel');

exports.signUp = async (req, res, next) => {
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
