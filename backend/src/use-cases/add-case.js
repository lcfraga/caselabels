const makeCase = require('../models/case')

module.exports = function makeAddCase ({ casesDb }) {
  return async function addCase (caseData) {
    const _case = makeCase(caseData)

    const existingCaseData = await casesDb.findByContent(_case.getContent())

    if (existingCaseData) {
      throw new Error('case exists')
    }

    const { id, content } = await casesDb.insert(
      Object.freeze({
        id: _case.getId(),
        content: _case.getContent()
      })
    )

    return Object.freeze({
      id,
      content
    })
  }
}
