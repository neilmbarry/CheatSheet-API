const express = require('express');
const morgan = require('morgan');

const cocktailRouter = require('./routes/cocktailRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  const error = new AppError(
    `Could not find ${req.originalUrl} on this route`,
    400
  );
  next(error);
});

app.use(globalErrorHandler);

module.exports = app;
