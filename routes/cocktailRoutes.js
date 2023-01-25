const express = require('express');

const {
  getAllCocktails,
  createCocktail,
  getCocktail,
  updateCocktail,
  deleteCocktail,
} = require('../controllers/cocktailController');

const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.route('/').get(getAllCocktails).post(protect, createCocktail);

// Define route to aggregate ingredients
// router.route('/');

router
  .route('/:slug')
  .get(getCocktail)
  .patch(protect, restrictTo('admin', 'author'), updateCocktail)
  .delete(protect, restrictTo('admin', 'author'), deleteCocktail);

module.exports = router;
