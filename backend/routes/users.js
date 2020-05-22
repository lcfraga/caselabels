const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')

const User = require('../models/user.model')

const router = express.Router()

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    res.status(401).send()
    return
  }

  const isValidPassword = await bcrypt.compare(req.body.password, user.password)

  if (!isValidPassword) {
    res.status(401).send()
    return
  }

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name
    },
    process.env.TOKEN_SECRET
  )

  res.send({
    id: user._id,
    name: user.name,
    token: token
  })
})

module.exports = router
