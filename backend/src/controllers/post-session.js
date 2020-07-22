module.exports = function makePostSession ({ addSession }) {
  return async function postSession (httpRequest) {
    try {
      const sessiondata = httpRequest.body
      const { data, token } = await addSession(sessiondata)

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        cookies: [
          {
            name: 'token',
            value: token,
            options: {
              secure: false,
              httpOnly: true
            }
          }
        ],
        statusCode: 201,
        body: { data }
      }
    } catch (e) {
      const statusCode = e.message === 'authentication failed' ? 401 : 400

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode,
        body: {
          error: e.message
        }
      }
    }
  }
}
