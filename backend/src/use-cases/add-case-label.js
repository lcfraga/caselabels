const makeCaseLabel = require('../models/caselabel')

module.exports = function makeAddCaseLabel ({ caseLabelsDb }) {
  return async function addCaseLabel (caseLabelData) {
    const caseLabel = makeCaseLabel(caseLabelData)

    const existingCaseLabelData = await caseLabelsDb.findByUserIdAndCaseId(
      caseLabel.getUserId(),
      caseLabel.getCaseId()
    )

    if (existingCaseLabelData) {
      throw new Error('case label exists')
    }

    const { id, userId, caseId, label, durationInMillis } = await caseLabelsDb.insert(
      Object.freeze({
        id: caseLabel.getId(),
        userId: caseLabel.getUserId(),
        caseId: caseLabel.getCaseId(),
        label: caseLabel.getLabel(),
        durationInMillis: caseLabel.getDurationInMillis()
      })
    )

    return Object.freeze({
      id,
      userId,
      caseId,
      label,
      durationInMillis
    })
  }
}
