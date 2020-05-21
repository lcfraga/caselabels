const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const caseLabelSchema = new Schema({
  caseId: {
    type: ObjectId,
    required: true
  },
  userId: {
    type: ObjectId,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  durationInMillis: {
    type: Number,
    required: true
  }
})

caseLabelSchema.index({ caseId: 1, userId: 1 }, { unique: true })

const CaseLabel = mongoose.model('CaseLabel', caseLabelSchema)

module.exports = CaseLabel
