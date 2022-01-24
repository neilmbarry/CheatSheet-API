const express = require('express');
const morgan = require('morgan');

const cocktailRouter = require('./routes/cocktailRoutes');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('hello from the middleware! 🙋‍♂️');
  next();
});

app.get('/', (req, res, next) => {
  console.log('On route');
  res.status(200).json({
    status: 'success',
    body: {
      message: 'I did it!',
    },
  });
});

app.use('/api/v1/cocktails', cocktailRouter);

module.exports = app;
