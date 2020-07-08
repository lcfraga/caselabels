function serialize (data) {
  if (!data) {
    return null
  }

  const { id, content } = data
  return { id, content }
}

function makeCasesDb (Case) {
  return Object.freeze({
    findById,
    findNextByUserId,
    insert
  })

  async function findById (id) {
    const result = await Case.findOne({ id }).exec()
    return serialize(result)
  }

  async function findNextByUserId (userId) {
    const results = await Case.findNextByUserId(userId).exec()
    return serialize(results[0])
  }

  async function insert (caseData) {
    const persistedCase = await Case.create(caseData)
    return serialize(persistedCase)
  }
}

module.exports = makeCasesDb
