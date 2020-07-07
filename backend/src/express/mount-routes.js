const { getLabels, postLabel } = require('../controllers')

const makeCallback = require('./callback')

function mountRoutes (app, pathPrefix, config) {
  app.use(`${pathPrefix}/users`, config.usersApp)
  app.use(`${pathPrefix}/cases`, config.casesApp)
  app.use(`${pathPrefix}/labels`, config.labelsApp)
  app.use(`${pathPrefix}/caselabels`, config.caseLabelsApp)

  app.get(`${pathPrefix}/new-labels`, makeCallback(getLabels))
  app.post(`${pathPrefix}/new-labels`, makeCallback(postLabel))
}

module.exports = mountRoutes
