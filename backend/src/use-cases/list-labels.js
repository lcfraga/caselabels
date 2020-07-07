module.exports = function makeListLabels ({ labelsDb }) {
  return async function listLabels () {
    return await labelsDb.findAll({ code: 1 })
  }
}
