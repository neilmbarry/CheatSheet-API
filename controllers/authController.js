const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

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
