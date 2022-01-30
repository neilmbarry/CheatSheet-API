const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

//TODO
// SIGN UP
// 1. Create new user
// 2. Log in
// 3. Persist login (create jsonwebtoken using user.id, JSONWEBTOKENSECRET, and options)
// 4. Attach to header as Auth (only for postman) and to req.cookie
//    respond with jsonwebtoken
// 5. Create protect middleware
//    (if there's no token on headers or cookie, return not logged in)
//    decode token and find user by id
//    assign req.user
// 6. Log in
//    Grab username and password from req.body
//    Find user from email / username
//    Use (create) schema method to compare passwords
//    if true, do step 3 and 4.

const createJsonWebToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    // ---- BELOW TO BE REFACTORED INTO SEPARATE FUNCTION ----- //
    const token = createJsonWebToken(newUser._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') {
      cookieOptions.secure = true;
    }
    newUser.password = undefined;
    res.cookie('jwt', token, cookieOptions);
    res.status(201).json({
      status: 'success',
      message: 'User is signed up',
      newUser,
      token,
    });
    // ------------------------------------------------------- //
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Please provide an email and password', 404));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.isCorrectPassword(password))) {
      return next(new AppError('Incorrect email or password.'));
    }
    // ---- BELOW TO BE REFACTORED INTO SEPARATE FUNCTION ----- //
    const token = createJsonWebToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') {
      cookieOptions.secure = true;
    }
    user.password = undefined;
    res.cookie('jwt', token, cookieOptions);
    res.status(201).json({
      status: 'success',
      message: 'User logged in.',
      user,
      token,
    });
    // ------------------------------------------------------- //
  } catch (err) {
    return next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    // Grab token from cookie or auth header
    const token =
      (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer') &&
        req.headers.authorization.split(' ')[1]) ||
      req.cookies.jwt;
    // If it does not exist res 'not logged in / Could not find token'
    if (!token) {
      return next(new AppError('User is not logged in.', 401));
    }

    // Verify token and isn't expired
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);
    // Find user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 404)
      );
    }
    // --- ADD CHECK TO SEE IF USER HAS RECENTLY CHANGED PASSWORD --- //
    req.user = user;
    next();
  } catch (err) {
    return next(err);
  }
};

// TODO

// FORGOT PASSWORD
exports.forgotPassword = async (req, res, next) => {
  // Check user exists from entered email address
  try {
    const { email } = req.body;
    if (!email) {
      return next(new AppError('Please provide an email.'));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Could not find user with that email address.'));
    }

    // Generate reset token from crypto, plus expiry
    // Save hashed token to user
    const resetToken = user.createPasswordResetToken();
    await user.save({
      validateBeforeSave: false,
    });
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/resetPassword/${resetToken}`;

    const message = `Forgot your password? Click the following link to reset it: ${resetURL}`;

    // Configure email client on config.env
    // Send reset token and address to email provided
    try {
      sendEmail({
        email,
        subject: 'You forgot your password, dumb dumb!',
        message,
      });
    } catch (err) {
      return next(new AppError('Error sending email. Please try again.', 500));
    }

    // respond with email sent
    res.status(200).json({
      status: 'success',
      message: 'Check your email for a reset link.',
      user,
    });
  } catch (err) {
    return next(err);
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res, next) => {
  try {
    // route /resetPassword/:resetToken
    const { resetToken } = req.params;
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    // find user with same resetToken

    const user = await User.findOne({ passwordResetToken: resetTokenHash });
    console.log('USER: ', user);
    if (!user) {
      return next(
        new AppError(
          'Could not find user associated with token, please try again.',
          404
        )
      );
    }

    // check if expired

    if (user.tokenExpired()) {
      return next(
        new AppError('Reset token has expired, please try again.', 400)
      );
    }

    // req.body should include password and passwordConfirm, and email?

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // update user with validators -- user.save()

    await user.save();
    user.password = undefined;

    // update user.passwordChangedAt\
    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    return next(err);
  }
};

// UPDATE PASSWORD (protect)
// route /updatePassword
// req.body should include current password, newPassword, and newPasswordConfirm
// findById and update
// update user with validators
// update user.passwordChangedAt
