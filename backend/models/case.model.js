const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const caseSchema = new Schema({
  content: {
    type: String,
    required: true,
    unique: true,
  },
});

caseSchema.statics.findNextForUser = function (userId) {
  return this.aggregate([
    {
      $lookup: {
        from: 'caselabels',
        localField: '_id',
        foreignField: 'caseId',
        as: 'labels',
      },
    },
    {
      $match: {
        'labels.userId': {
          $ne: mongoose.Types.ObjectId(userId),
        },
      },
    },
    {
      $limit: 1,
    },
    {
      $project: {
        id: 1,
        content: 1,
      },
    },
  ]);
};

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
