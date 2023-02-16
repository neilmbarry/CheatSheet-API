const express = require('express');

const {
  getAllCocktails,
  createCocktail,
  getCocktail,
  updateCocktail,
  deleteCocktail,
  randomCocktail,
} = require('../controllers/cocktailController');

const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.route('/').get(getAllCocktails).post(protect, createCocktail);

router.route('/random').get(randomCocktail);

router
  .route('/:slug')
  .get(getCocktail)
  .patch(updateCocktail)
  .delete(protect, restrictTo('admin', 'author'), deleteCocktail);

module.exports = router;
