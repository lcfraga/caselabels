function serialize (data) {
  if (!data) {
    return null
  }

  const { id, userId, caseId, label, durationInMillis } = data
  return { id, userId, caseId, label, durationInMillis }
}

function makeCasesLabelsDb (CaseLabel) {
  return Object.freeze({
    findByUserIdAndCaseId,
    insert,
    deleteAll
  })

  async function findByUserIdAndCaseId (userId, caseId) {
    const result = await CaseLabel.findOne({ userId, caseId }).exec()
    return serialize(result)
  }

  async function insert (caseLabelData) {
    const persistedCaseLabel = await CaseLabel.create(caseLabelData)
    return serialize(persistedCaseLabel)
  }

  async function deleteAll () {
    await CaseLabel.deleteMany()
  }
}

module.exports = makeCasesLabelsDb
