const chai = require('chai')
const chaiHttp = require('chai-http')

const { app } = require('../../src')

const { expect, use } = chai

use(chaiHttp)

describe('POST /users/login', function () {
  context('with invalid credentials', function () {
    [
      {},
      { email: 'jsilver@hospital.com', password: '' },
      { email: '', password: 'password' },
      { email: 'jsilver@hospital.com', password: '12345678' }
    ].map((invalidCredentials) => {
      const { email, password } = invalidCredentials

      context(`${email}:${password}`, function () {
        it('should return 401', function (done) {
          chai
            .request(app)
            .post('/users/login')
            .send(invalidCredentials)
            .end((err, res) => {
              expect(res.status).to.equal(401)
              expect(res.body).to.be.empty
              done()
            })
        })
      })
    })
  })

  context('with valid credentials', function () {
    [
      { email: 'jsilver@hospital.com', password: 'password', name: 'J. Silver' },
      { email: 'hstevens@clinic.com', password: '12345678', name: 'H. Stevens' }
    ].map((validCredentials) => {
      const { email, password, name } = validCredentials

      context(`${email}:${password}`, function () {
        it('should return 200 and user id, name and token in body', function (done) {
          chai
            .request(app)
            .post('/users/login')
            .send({
              email: email,
              password: password
            })
            .end((err, res) => {
              expect(res.status).to.equal(200)
              expect(res.body.id).to.be.not.empty
              expect(res.body.name).to.equal(name)
              expect(res.body.token).to.be.not.empty
              done()
            })
        })
      })
    })
  })
})
