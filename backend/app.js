const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const ErrorManager = require('./errors/error-manager');
const {
  signupValid,
  loginValid,
} = require('./middlewares/users-validate');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');
const { errors } = require('celebrate');


const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

// app security
app.use(helmet());

// parse the body of all post reqeusts
app.use(express.json());

// enable the request logger
app.use(requestLogger);

app.post('/signin', loginValid, login);
app.post('/signup', signupValid, createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

// enable & use error logger
app.use(errorLogger);
app.use(errors());

app.get('*', (req, res, next) => {
  next(new ErrorManager(404, 'Requested resource not found'));
});

// centralized error handling
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message : statusCode === 500
      ? 'An error occured on the server'
      : message
    });
})

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
