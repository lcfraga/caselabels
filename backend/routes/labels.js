const express = require('express')
const router = express.Router()
const Label = require('../models/label.model')

router.get('/', async (req, res) => {
  const labels = await Label.find({}, { _id: 0 }).sort({ code: 1 })

  res.send(labels)
})

module.exports = router
