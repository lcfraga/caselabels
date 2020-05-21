const express = require('express')
const router = express.Router()
const Case = require('../models/case.model')

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
