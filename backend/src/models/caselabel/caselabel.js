module.exports = function buildMakeCaseLabel ({ caseLabelValidator, makeId }) {
  return function makeCaseLabel ({
    id = makeId(),
    userId,
    caseId,
    label,
    durationInMillis
  }) {
    const { error } = caseLabelValidator({ id, userId, caseId, label, durationInMillis })

    if (error) {
      throw new Error(error)
    }

    return Object.freeze({
      getId: () => id,
      getUserId: () => userId,
      getCaseId: () => caseId,
      getLabel: () => label,
      getDurationInMillis: () => durationInMillis
    })
  }
}
