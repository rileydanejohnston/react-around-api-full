const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');


const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

// app security
app.use(helmet());

// parse the body of all post reqeusts
app.use(express.json());

app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).max(30),
    email: Joi.string().required(),
    password: Joi.string().min(8).required(),
  })
}),createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
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
