module.exports = function makeDeleteAll ({ removeAll }) {
  return async function deleteAll () {
    await removeAll()

    return {
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: 200,
      body: { }
    }
  }
}
