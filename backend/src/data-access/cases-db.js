function serialize (data) {
  if (!data) {
    return null
  }

  const { id, content } = data
  return { id, content }
}

function makeCasesDb (Case) {
  return Object.freeze({
    findByContent,
    findNextByUserId,
    insert,
    deleteAll
  })

  async function findByContent (content) {
    const result = await Case.findOne({ content }).exec()
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

  async function deleteAll () {
    await Case.deleteMany()
  }
}

module.exports = makeCasesDb
