# Cheat-Sheet-API

This is the back end server that works in conjunction with [_Cheat-Sheet-App_] (https://simp-app.vercel.app/) on the front end.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Code Structure](#code-structure)
- [Contact](#contact)

## Technologies Used

- Node.js
- Mongo DB
- Mongoose
- Express

## Code structure

This application can be divided into three : database models, routes and controllers.

It is an express application using mongoose to communication with a mongoDB database. The code is divided into three main distinct parts being routes for different api calls, models for modeling the database entries, and controllers for describing the data transformations and flow.

A collection of routes
![Example screenshot](https://i.imgur.com/rr1usYn.png)
A mongoose model
![Example screenshot](https://i.imgur.com/3HAvOIy.png)
A controller function
![Example screenshot](https://i.imgur.com/PcGG9gK.png)

## To run locally

- Clone repository to your local device
- Navigate to the ship-head folder
- Run `npm install` to install all the dependencies
- Run `npm start:dev` to to run the development server that the main application will connect to.
- You will need to add your own config.env file with the following variable to run the server and connect to your own MongoDB database:

> NODE_ENV='development'
> PORT=8000
> JWT_SECRET={YOUR_SECRET}
> JWT_EXPIRES_IN=90d
> JWT_COOKIE_EXPIRES_IN=90d
> DATABASE=mongodb+srv://{YOUR_MONGO_DB_DATABASE}
> DATABASE_PASSWORD={YOUR_DB_PASSWORD}

## Project Status

Project is: _complete_

## Contact

Created by [@neilbarry](https://www.neilbarry.com/) - feel free to contact me!
