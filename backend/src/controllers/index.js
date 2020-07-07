const { addLabel, listLabels } = require('../use-cases')

const makeGetLabels = require('./get-labels')
const makePostLabel = require('./post-label')

const getLabels = makeGetLabels({ listLabels })
const postLabel = makePostLabel({ addLabel })

module.exports = Object.freeze({
  getLabels,
  postLabel
})
