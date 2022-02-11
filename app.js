const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const cocktailRouter = require('./routes/cocktailRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware! 🙋‍♂️');
  next();
});

app.use((req, res, next) => {
  req.requestedAt = new Date().toString();
  next();
});

app.use('/api/v1/cocktails', cocktailRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  const error = new AppError(
    `Could not find ${req.originalUrl} on this route`,
    400
  );
  next(error);
});

app.use(globalErrorHandler);

module.exports = app;
