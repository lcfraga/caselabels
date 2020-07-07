module.exports = function makePostLabel ({ addLabel }) {
  return async function postLabel (httpRequest) {
    try {
      const { source = {}, ...labelData } = httpRequest.body

      source.ip = httpRequest.ip
      source.browser = httpRequest.headers['User-Agent']

      if (httpRequest.headers.Referer) {
        source.referrer = httpRequest.headers.Referer
      }

      const data = await addLabel({
        ...labelData,
        source
      })

      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(data.modifiedOn).toUTCString()
        },
        statusCode: 201,
        body: { data }
      }
    } catch (e) {
      console.error(e)

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
