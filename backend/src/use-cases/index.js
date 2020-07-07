const { labelsDb } = require('../data-access')

const makeAddLabel = require('./add-label')
const makeListLabels = require('./list-labels')

const addLabel = makeAddLabel({ labelsDb })
const listLabels = makeListLabels({ labelsDb })

module.exports = Object.freeze({
  addLabel,
  listLabels
})
