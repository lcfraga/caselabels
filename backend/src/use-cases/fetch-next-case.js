module.exports = function makeFetchNextCase ({ casesDb }) {
  return async function fetchNextCase (userId) {
    const nextCase = await casesDb.findNextByUserId(userId)

    if (!nextCase) {
      throw new Error('not found')
    }

    return nextCase
  }
}
