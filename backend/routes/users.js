const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(401).send();
    return;
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isValidPassword) {
    res.status(401).send();
    return;
  }

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
    },
    process.env.TOKEN_SECRET
  );

  res.send({
    id: user._id,
    name: user.name,
    token: token,
  });
});

module.exports = router;
