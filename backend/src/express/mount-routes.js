function mountRoutes (app, pathPrefix, config) {
  app.use(`${pathPrefix}/users`, config.usersApp)
  app.use(`${pathPrefix}/cases`, config.casesApp)
  app.use(`${pathPrefix}/labels`, config.labelsApp)
  app.use(`${pathPrefix}/caselabels`, config.caseLabelsApp)
}

module.exports = mountRoutes
