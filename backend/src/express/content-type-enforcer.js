function createContentTypeEnforcer ({ allowedContentTypes }) {
  return function contentTypeEnforcer (req, res, next) {
    for (const contentType of allowedContentTypes) {
      const result = req.is(contentType)

      if (result === null || result !== false) {
        next()
        return
      }
    }

    res.status(415)
    res.end()
  }
}

module.exports = createContentTypeEnforcer
