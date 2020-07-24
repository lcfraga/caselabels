const {
  addLabel,
  listLabels,
  addSession,
  addUser,
  addCase,
  fetchNextCase,
  addCaseLabel,
  removeAll
} = require('../use-cases')

const makeDeleteAll = require('./delete-all')
const makeDeleteSession = require('./delete-session')
const makeGetCase = require('./get-case')
const makeGetLabels = require('./get-labels')
const makeNotFound = require('./not-found')
const makePostCase = require('./post-case')
const makePostCaseLabel = require('./post-caselabel')
const makePostLabel = require('./post-label')
const makePostSession = require('./post-session')
const makePostUser = require('./post-user')

const getLabels = makeGetLabels({ listLabels })
const postLabel = makePostLabel({ addLabel })
const postSession = makePostSession({ addSession })
const deleteSession = makeDeleteSession()
const postUser = makePostUser({ addUser })
const getCase = makeGetCase({ fetchNextCase })
const postCase = makePostCase({ addCase })
const postCaseLabel = makePostCaseLabel({ addCaseLabel })
const deleteAll = makeDeleteAll({ removeAll })
const notFound = makeNotFound()

module.exports = Object.freeze({
  getLabels,
  postLabel,
  postSession,
  deleteSession,
  postUser,
  getCase,
  postCase,
  postCaseLabel,
  deleteAll,
  notFound
})
