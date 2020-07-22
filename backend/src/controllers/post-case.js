module.exports = function makePostCase ({ addCase }) {
  return async function postCase (httpRequest) {
    try {
      const caseData = httpRequest.body
      const data = await addCase(caseData)

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
