const express = require('express');

const {
  getAllCocktails,
  createCocktail,
  getCocktail,
  updateCocktail,
  deleteCocktail,
} = require('../controllers/cocktailController');

const { protect, restrictTo } = require('../controllers/authController');

const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:cocktailId/reviews', reviewRouter);

router.route('/').get(getAllCocktails).post(protect, createCocktail);

router.route('/');

router
  .route('/:id')
  .get(getCocktail)
  .patch(protect, restrictTo('admin', 'author'), updateCocktail)
  .delete(protect, restrictTo('admin', 'author'), deleteCocktail);

module.exports = router;
