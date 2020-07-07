function _serializeSingle ({ code, description }) {
  return { code, description }
}

function _serialize (data) {
  if (!data) {
    return null
  }

  if (Array.isArray(data)) {
    return data.map(_serializeSingle)
  }

  return _serializeSingle(data)
}

function makeLabelsDb (Label) {
  return Object.freeze({
    findAll,
    findByCode,
    insert
  })

  async function findAll (sortBy = {}) {
    const results = await Label.find({}).sort(sortBy).exec()
    return _serialize(results)
  }

  async function findByCode (code) {
    const result = await Label.findOne({ code }).exec()
    return _serialize(result)
  }

  async function insert (label) {
    const newLabel = {
      code: label.getCode(),
      description: label.getDescription()
    }

    const persistedLabel = await Label.create(newLabel)
    return _serialize(persistedLabel)
  }
}

module.exports = makeLabelsDb
