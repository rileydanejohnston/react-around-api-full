const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

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

app.use('/', userRouter);
app.use('/', cardRouter);

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
