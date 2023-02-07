const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const Cocktail = require('../models/cocktailModel');
const Review = require('../models/reviewModel');


const createJsonWebToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signUp = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = createJsonWebToken(user._id);

    user.password = undefined;
    res.status(201).json({
      status: 'success',
      message: 'You have been signed up!',
      user,
      token,
    });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new AppError('Please provide an username and password', 404));
    }

    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await user.isCorrectPassword(password))) {
      return next(new AppError('Incorrect username or password.'));
    }

    const token = createJsonWebToken(user._id);
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      message: 'User logged in.',
      user,
      token,
    });
  } catch (err) {
    return next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(
        new AppError('You must be logged in to perform this action.', 401)
      );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 404)
      );
    }

    req.user = user;
    next();
  } catch (err) {
    return next(err);
  }
};

exports.restrictTo = (...users) => {
  return async (req, res, next) => {
    try {
      if (users.includes('author')) {
        const { slug } = req.params;
        let isAuthor = false;
        const model = req.baseUrl.split('/')[3];
        if (model === 'cocktails') {
          const cocktail = await await Cocktail.findOne({ slug });
          if (!cocktail) {
            return next(new AppError('Cocktail not found', 404));
          }
          const cocktailAuthorId = cocktail.createdBy.toString();
          isAuthor = req.user.id == cocktailAuthorId ? true : false;
        }
        if (model === 'reviews') {
          const review = await Review.findById(req.params.id);

          if (!review) {
            return next(new AppError('Review not found', 404));
          }
          const reviewAuthorId = review.user.toString();
          isAuthor = req.user.id == reviewAuthorId ? true : false;
        }
        if (!isAuthor) {
          if (users.includes(req.user.role)) {
            return next();
          }
          return next(new AppError('You are not the author.', 401));
        }
      } else {
        if (!users.includes(req.user.role)) {
          return next(new AppError('You do not have permissions.', 401));
        }
      }

      next();
    } catch (err) {
      return next(err);
    }
  };
};
