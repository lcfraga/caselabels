module.exports = function makeGetLabels ({ listLabels }) {
  return async function getLabels (httpRequest) {
    const headers = {
      'Content-Type': 'application/json'
    }

    try {
      const data = await listLabels()

      return {
        headers,
        statusCode: 200,
        body: { data }
      }
    } catch (e) {
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message
        }
      }
    }
  }
}
