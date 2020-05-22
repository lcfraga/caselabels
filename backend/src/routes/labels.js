const express = require('express')

const Label = require('../models/label.model')

const router = express.Router()

router.get('/', async (req, res) => {
  const labels = await Label.find({}, { _id: 0 }).sort({ code: 1 })

  res.send(labels)
})

module.exports = router
