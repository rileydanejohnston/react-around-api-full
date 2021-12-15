const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');


const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

// app security
app.use(helmet());

// parse the body of all post reqeusts
app.use(express.json());

// middleware to apply all cards the same owner ID
app.use((req, res, next) => {
  req.user = {
    _id: '618c370909a5afd80fca18fa',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

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

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
