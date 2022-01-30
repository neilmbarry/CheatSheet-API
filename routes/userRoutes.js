const express = require('express');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getMe,
} = require('../controllers/userController');

const {
  signUp,
  login,
  protect,
  forgotPassword,
} = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/login').post(login);
router.route('/me').get(protect, getMe, getUser);

router.route('/forgotPassword').post(forgotPassword);

router.route('/').get(protect, getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
