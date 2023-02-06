const express = require('express');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  toggleFave,
  getFaves,
} = require('../controllers/userController');

const {
  signUp,
  login,
  protect,

  restrictTo,
} = require('../controllers/authController');

const router = express.Router();

router.route('/').get(getAllUsers);

router.route('/signup').post(signUp);

router.route('/login').post(login);

// Must be logged in to access routes below
router.use(protect);

router.route('/me').get(getMe, getUser).patch(updateUser);

router.route('/toggleFave').patch(toggleFave);

router.route('/getFaves').get(getFaves);

// Must be ADMIN to access routes below
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
