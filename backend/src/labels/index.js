const express = require('express')

const Label = require('./model')

const router = express.Router()

router.get('/', async (req, res) => {
  const labels = await Label.find({}, { _id: 0 }).sort({ code: 1 })

  res.json(labels)
})

module.exports = router
