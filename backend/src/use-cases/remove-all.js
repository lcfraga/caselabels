module.exports = function makeRemoveAll ({ casesDb, labelsDb, caseLabelsDb, usersDb }) {
  return async function removeAll () {
    await casesDb.deleteAll()
    await labelsDb.deleteAll()
    await caseLabelsDb.deleteAll()
    await usersDb.deleteAll()
  }
}
