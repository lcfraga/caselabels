const {
  getLabels,
  postLabel,
  postSession,
  deleteSession,
  postUser,
  getCase,
  postCase,
  postCaseLabel,
  notFound
} = require('../controllers')

const makeCallback = require('./callback')

function mountRoutes (app, { pathPrefix }) {
  app.route(`${pathPrefix}/labels`)
    .get(makeCallback(getLabels))
    .post(makeCallback(postLabel))

  app.get(`${pathPrefix}/cases/next`, makeCallback(getCase))
  app.post(`${pathPrefix}/cases`, makeCallback(postCase))
  app.post(`${pathPrefix}/caselabels`, makeCallback(postCaseLabel))

  app.post(`${pathPrefix}/users`, makeCallback(postUser))

  app.post(`${pathPrefix}/sessions`, makeCallback(postSession))
  app.delete(`${pathPrefix}/sessions`, makeCallback(deleteSession))

  app.use(makeCallback(notFound))
}

module.exports = mountRoutes
