const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Case = require('../models/case.model');

router.get('/next', auth, async (req, res) => {
  const user = req.user;
  const nextCase = await Case.findNextForUser(user.id);

  res.send(nextCase);
});

module.exports = router;
