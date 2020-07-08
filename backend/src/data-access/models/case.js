module.exports = function makeCaseModel (mongoose) {
  const Schema = mongoose.Schema

  const caseSchema = new Schema({
    id: {
      type: String,
      required: true,
      unique: true
    },
    content: {
      type: String,
      required: true,
      unique: true
    }
  })

  caseSchema.statics.findNextByUserId = function (userId) {
    return this.aggregate([
      {
        $lookup: {
          from: 'caselabels',
          localField: 'id',
          foreignField: 'caseId',
          as: 'labels'
        }
      },
      {
        $match: {
          'labels.userId': {
            $ne: userId
          }
        }
      },
      {
        $limit: 1
      }, {
        $project: {
          _id: 0,
          id: 1,
          content: 1
        }
      }
    ])
  }

  return mongoose.model('NewCase', caseSchema, 'cases')
}
