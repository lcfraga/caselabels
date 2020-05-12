const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

const app = express();

app.use(logger('dev'));
app.use(express.json());

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const usersRouter = require('./routes/users');
const casesRouter = require('./routes/cases');
const labelsRouter = require('./routes/labels');
const caseLabelsRouter = require('./routes/caselabels');

app.use('/users', usersRouter);
app.use('/cases', casesRouter);
app.use('/labels', labelsRouter);
app.use('/caselabels', caseLabelsRouter);

app.use((req, res) => {
  res.status(404).send();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

module.exports = app;
