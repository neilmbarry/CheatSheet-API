const express = require('express');

const {
  getAllCocktails,
  createCocktail,
  getCocktail,
  updateCocktail,
  deleteCocktail,
} = require('../controllers/cocktailController');

const { protect } = require('../controllers/authController');

const router = express.Router();

router.route('/').get(getAllCocktails).post(protect, createCocktail);

router
  .route('/:id')
  .get(getCocktail)
  .patch(protect, updateCocktail)
  .delete(protect, deleteCocktail);

module.exports = router;
