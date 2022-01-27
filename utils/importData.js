const mongoose = require('mongoose');
const fs = require('fs');
// const path = require('path');
const dotenv = require('dotenv');
const Cocktail = require('../models/cocktailModel');

dotenv.config({ path: `${__dirname}/../config.env` });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('Connected to MongoDB');
});

const addCocktails = async () => {
  try {
    console.log('Importing cocktails...');
    await Cocktail.create(
      JSON.parse(
        fs.readFileSync(`${__dirname}/../dev-data/dummyCocktails.json`),
        'utf-8'
      )
    );
    console.log('Cocktails imported!');
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const deleteCocktails = async () => {
  try {
    console.log('Deleting cocktails...');
    await Cocktail.deleteMany();
    console.log('Cocktails deleted!');
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const resetCocktails = async () => {
  try {
    console.log('Deleting cocktails...');

    await Cocktail.deleteMany();
    console.log('Cocktails deleted!');
    console.log('Importing cocktails...');
    await Cocktail.create(
      JSON.parse(
        fs.readFileSync(`${__dirname}/../dev-data/dummyCocktails.json`),
        'utf-8'
      )
    );
    console.log('Cocktails imported!');
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

if (process.argv[2] === '--import') {
  addCocktails();
}

if (process.argv[2] === '--delete') {
  deleteCocktails();
}

if (process.argv[2] === '--reset') {
  resetCocktails();
}
