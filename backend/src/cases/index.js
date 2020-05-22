const express = require('express')

const Case = require('./model')

const router = express.Router()

router.get('/next', async (req, res) => {
  const user = req.user
  const nextCases = await Case.findNextForUser(user.id)

  if (nextCases.length === 0) {
    res.status(404).send()
  } else {
    res.send(nextCases[0])
  }
})

module.exports = router
