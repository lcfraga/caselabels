const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const mongoose = require('mongoose');
const env = require('./env');
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

mongoose.connect(env.databaseUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const usersRouter = require('./routes/users');
const casesRouter = require('./routes/cases');
const labelsRouter = require('./routes/labels');
const caseLabelsRouter = require('./routes/caselabels');

const createAuth = require('./middleware/auth');
const auth = createAuth(env);

app.use('/users', usersRouter);
app.use('/cases', auth, casesRouter);
app.use('/labels', auth, labelsRouter);
app.use('/caselabels', auth, caseLabelsRouter);

app.use((req, res) => {
  res.status(404).send();
});

app.listen(env.port, () => {
  console.log(`${env.appName}:${env.version} listening on port ${env.port}.`);
});

module.exports = app;
