module.exports = function makeGetCase ({ fetchNextCase }) {
  return async function getCase (httpRequest) {
    const headers = {
      'Content-Type': 'application/json'
    }

    try {
      const data = await fetchNextCase(httpRequest.user.id)

      return {
        headers,
        statusCode: 200,
        body: { data }
      }
    } catch (e) {
      console.error(e)

      const statusCode = e.message === 'not found' ? 404 : 400

      return {
        headers,
        statusCode,
        body: {
          error: e.message
        }
      }
    }
  }
}
