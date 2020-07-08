function serialize (data) {
  if (!data) {
    return null
  }

  const { code, description } = data
  return { code, description }
}

function makeLabelsDb (Label) {
  return Object.freeze({
    findAll,
    findByCode,
    insert
  })

  async function findAll (sortBy = {}) {
    const results = await Label.find({}).sort(sortBy).exec()
    return results.map(serialize)
  }

  async function findByCode (code) {
    const result = await Label.findOne({ code }).exec()
    return serialize(result)
  }

  async function insert (labelData) {
    const persistedLabel = await Label.create(labelData)
    return serialize(persistedLabel)
  }
}

module.exports = makeLabelsDb
