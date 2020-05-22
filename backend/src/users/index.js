const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')

const User = require('./model')

const router = express.Router()

router.post('/', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (user) {
    res.status(409).send()
    return
  }

  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })

  try {
    await newUser.save()
    res.status(201).send()
  } catch (err) {
    res.status(400).send()
  }
})

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
    process.env.TOKEN_SECRET // TODO: This should come from the env module.
  )

  res.send({
    id: user._id,
    name: user.name,
    token: token
  })
})

module.exports = router
