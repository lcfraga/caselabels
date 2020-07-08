const {
  getLabels,
  postLabel,
  postSession,
  deleteSession,
  postUser,
  getCase,
  postCase,
  postCaseLabel
} = require('../controllers')

const makeCallback = require('./callback')

function mountRoutes (app, pathPrefix, config) {
  app.use(`${pathPrefix}/users`, config.usersApp)
  app.use(`${pathPrefix}/cases`, config.casesApp)
  app.use(`${pathPrefix}/labels`, config.labelsApp)
  app.use(`${pathPrefix}/caselabels`, config.caseLabelsApp)

  app.get(`${pathPrefix}/new-labels`, makeCallback(getLabels))
  app.post(`${pathPrefix}/new-labels`, makeCallback(postLabel))

  app.post(`${pathPrefix}/new-users`, makeCallback(postUser))

  app.post(`${pathPrefix}/sessions`, makeCallback(postSession))
  app.delete(`${pathPrefix}/sessions`, makeCallback(deleteSession))

  app.get(`${pathPrefix}/new-cases/next`, makeCallback(getCase))
  app.post(`${pathPrefix}/new-cases`, makeCallback(postCase))

  app.post(`${pathPrefix}/new-caselabels`, makeCallback(postCaseLabel))
}

module.exports = mountRoutes
