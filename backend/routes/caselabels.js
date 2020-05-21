const express = require('express')
const router = express.Router()
const CaseLabel = require('../models/caselabel.model')

router.post('/', async (req, res) => {
  const caseLabel = new CaseLabel({
    userId: req.user.id,
    caseId: req.body.caseId,
    label: req.body.label,
    durationInMillis: req.body.durationInMillis
  })

  await caseLabel.save((error) => {
    if (!error) {
      res.status(201).send()
      return
    }

    if (error.code && error.code === 11000) {
      res.status(409).send()
      return
    }

    if (error.errors) {
      res.status(400).send()
    }

    res.status(500).send()
  })
})

module.exports = router
