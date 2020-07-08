const { casesDb, labelsDb, caseLabelsDb, usersDb } = require('../data-access')
const { passwordHasher, passwordChecker, tokenGenerator } = require('../security')

const makeAddCase = require('./add-case')
const makeAddCaseLabel = require('./add-case-label')
const makeAddLabel = require('./add-label')
const makeAddSession = require('./add-session')
const makeAddUser = require('./add-user')
const makeFetchNextCase = require('./fetch-next-case')
const makeListLabels = require('./list-labels')

const addCase = makeAddCase({ casesDb })
const fetchNextCase = makeFetchNextCase({ casesDb })
const addLabel = makeAddLabel({ labelsDb })
const listLabels = makeListLabels({ labelsDb })
const addCaseLabel = makeAddCaseLabel({ caseLabelsDb })

const addSession = makeAddSession({ usersDb, passwordChecker, tokenGenerator })
const addUser = makeAddUser({ usersDb, passwordHasher })

module.exports = Object.freeze({
  addLabel,
  listLabels,
  addSession,
  addUser,
  fetchNextCase,
  addCase,
  addCaseLabel
})
