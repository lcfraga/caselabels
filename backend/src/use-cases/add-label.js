const makeLabel = require('../models/label/index')

module.exports = function makeAddLabel ({ labelsDb }) {
  return async function addLabel (labelData) {
    const label = makeLabel(labelData)

    const existingLabel = await labelsDb.findByCode(label.getCode())

    if (existingLabel) {
      return existingLabel
    }

    return await labelsDb.insert(label)
  }
}
