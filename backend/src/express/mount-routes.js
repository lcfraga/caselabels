function mountRoutes (app, config) {
  app.use('/users', config.usersApp)
  app.use('/cases', config.casesApp)
  app.use('/labels', config.labelsApp)
  app.use('/caselabels', config.caseLabelsApp)
}

module.exports = mountRoutes
