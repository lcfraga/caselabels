module.exports = function makeCaseModel (mongoose) {
  const Schema = mongoose.Schema

  const caseLabelSchema = new Schema({
    id: {
      type: String,
      required: true,
      unique: true
    },
    caseId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
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

  caseLabelSchema.index({ userId: 1, caseId: 1 }, { unique: true })

  return mongoose.model('NewCaseLabel', caseLabelSchema, 'caselabels')
}
