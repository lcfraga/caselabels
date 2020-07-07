module.exports = function makeLabelModel (mongoose) {
  const Schema = mongoose.Schema

  const labelSchema = new Schema({
    code: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    }
  })

  return mongoose.model('NewLabel', labelSchema, 'labels')
}
