module.exports = function makePostCaseLabel ({ addCaseLabel }) {
  return async function postCaseLabel (httpRequest) {
    try {
      const caseLabelData = httpRequest.body
      const data = await addCaseLabel({ userId: httpRequest.user.id, ...caseLabelData })

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
