const express = require('express')

const CaseLabel = require('./model')

const router = express.Router()

router.post('/', async (req, res) => {
  const caseLabel = new CaseLabel({
    userId: req.user.id,
    caseId: req.body.caseId,
    label: req.body.label,
    durationInMillis: req.body.durationInMillis
  })

  await caseLabel.save((error) => {
    if (!error) {
      res.status(201).end()
      return
    }

    if (error.code && error.code === 11000) {
      res.status(409).end()
      return
    }

    if (error.errors) {
      res.status(400).end()
    }

    res.status(500).end()
  })
})

module.exports = router
