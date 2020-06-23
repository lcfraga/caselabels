const bcrypt = require('bcryptjs')
const express = require('express')

const User = require('./model')

const tokenCookieName = 'token'

function createUsersApp (generateJwt) {
  const router = express.Router()

  router.post('/', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })

    if (user) {
      res.status(409).end()
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
      res.status(201).end()
    } catch (err) {
      res.status(400).end()
    }
  })

  router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      res.status(401).end()
      return
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password)

    if (!isValidPassword) {
      res.status(401).end()
      return
    }

    await generateJwt(res, user, tokenCookieName)

    res.json({
      id: user._id,
      name: user.name
    })
  })

  router.post('/logout', async (req, res) => {
    const cookieOptions = {
      maxAge: 0,
      secure: false,
      httpOnly: true
    }

    return res
      .cookie(tokenCookieName, '', cookieOptions)
      .status(200)
      .end()
  })

  return router
}

module.exports = createUsersApp
