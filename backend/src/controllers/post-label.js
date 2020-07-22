module.exports = function makePostLabel ({ addLabel }) {
  return async function postLabel (httpRequest) {
    try {
      const labelData = httpRequest.body
      const data = await addLabel(labelData)

      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date().toUTCString()
        },
        statusCode: 201,
        body: { data }
      }
    } catch (e) {
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 400,
        body: {
          error: e.message
        }
      }
    }
  }
}
