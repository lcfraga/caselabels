const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Label = require('../models/label.model');

router.get('/', auth, async (req, res, next) => {
  const labels = await Label.find({}, { _id: 0 }).sort({ code: 1 });

  res.send(labels);
});

module.exports = router;
