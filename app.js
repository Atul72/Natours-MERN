const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');
const reviewRouter = require('./routes/review-routes');

const app = express();

// 1)GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP,Please try again in an hour!',
});

app.use('/api', limiter);

// Middleware :---> Morgan (logging middleware) --> It allow us to see request data in the console.

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  }) // This package will then understand when we have a body larger than 10kb it will not be accepted
); // We use that middleware to get access to the request body on the request object.
// In each middleware function we have access to the request and response
// Our route handlers are also middleware that only apply for a certain URL.

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // it is a function that will call which then return a middleware function

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQunatity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`)); // it sets public folder as root folder so we don't need to write public in URL.

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter); // this is called mounting the router, means mounting a new router on a route (this is middleware.)
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // all used for all the http methods. * for any URL.

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
