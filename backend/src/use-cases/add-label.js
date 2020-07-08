const makeLabel = require('../models/label')

module.exports = function makeAddLabel ({ labelsDb }) {
  return async function addLabel (labelData) {
    const label = makeLabel(labelData)

    const existingLabelData = await labelsDb.findByCode(label.getCode())

    if (existingLabelData) {
      throw new Error('label exists')
    }

    const { code, description } = await labelsDb.insert(
      Object.freeze({
        code: label.getCode(),
        description: label.getDescription()
      })
    )

    return Object.freeze({
      code,
      description
    })
  }
}
