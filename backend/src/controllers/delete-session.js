module.exports = function makeDeleteSession () {
  return async function deleteSession (httpRequest) {
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      cookies: [
        {
          name: 'token',
          value: '',
          options: {
            maxAge: 0,
            secure: false,
            httpOnly: true
          }
        }
      ],
      statusCode: 200,
      body: { }
    }
  }
}
