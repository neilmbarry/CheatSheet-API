const express = require('express');

const {
  getAllCocktails,
  createCocktail,
  getCocktail,
  updateCocktail,
  deleteCocktail,
} = require('../controllers/cocktailController');

const router = express.Router();

router.route('/').get(getAllCocktails).post(createCocktail);

router
  .route('/:id')
  .get(getCocktail)
  .patch(updateCocktail)
  .delete(deleteCocktail);

module.exports = router;
