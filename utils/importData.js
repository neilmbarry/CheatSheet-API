const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Cocktail = require('../models/cocktailModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');

dotenv.config({ path: `${__dirname}/../config.env` });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('Connected to MongoDB');
});

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/dummyUsers.json`),
  'utf-8'
);

const cocktails = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/dummyCocktails.json`),
  'utf-8'
);
const testCocktails = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/testCocktails.json`),
  'utf-8'
);
const testReviews = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/testReviews.json`),
  'utf-8'
);

const addData = async () => {
  try {
    console.log('Importing cocktails...');

    await Cocktail.create(testCocktails);
    console.log('Cocktails imported!');

    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    console.log('Deleting data...');
    await Cocktail.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted!');
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const deleteUsers = async () => {
  try {
    console.log('Deleting users...');

    await User.deleteMany();
    console.log('Users deleted!');
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
const deleteReviews = async () => {
  try {
    console.log('Deleting reviews...');

    await Review.deleteMany();
    console.log('reviews deleted!');
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const resetData = async () => {
  try {
    console.log('Deleting data...');

    await Cocktail.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted!');
    console.log('Importing data...');
    await Cocktail.create(testCocktails, {
      validateBeforeSave: false,
    });
    await Review.create(testReviews, {
      validateBeforeSave: false,
    });

    console.log('Data imported!');
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

if (process.argv[2] === '--import') {
  addData();
}

if (process.argv[2] === '--deleteUsers') {
  deleteUsers();
}
if (process.argv[2] === '--deleteReviews') {
  deleteReviews();
}

if (process.argv[2] === '--delete') {
  deleteData();
}

if (process.argv[2] === '--reset') {
  resetData();
}
