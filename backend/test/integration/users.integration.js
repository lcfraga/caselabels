const chai = require('chai')
const chaiHttp = require('chai-http')

const { app } = require('../../src')

const { expect, use } = chai

use(chaiHttp)

describe('POST /sessions', function () {
  context('with invalid credentials', function () {
    [
      {
        credentials: {},
        errors: ['"email" is required', '"password" is required']
      },
      {
        credentials: { email: 'jsilver@jsilver.com' },
        errors: ['"password" is required']
      },
      {
        credentials: { email: 'jsilver@jsilver.com', password: '' },
        errors: ['"password" is not allowed to be empty']
      },
      {
        credentials: { password: 'password' },
        errors: ['"email" is required']
      },
      {
        credentials: { email: '', password: 'password' },
        errors: ['"email" is not allowed to be empty']
      },
      {
        credentials: { email: 'jsilver', password: 'password' },
        errors: ['"email" must be a valid email']
      }
    ].map((testParams) => {
      const { credentials, errors } = testParams

      context(`${credentials.email}:${credentials.password}`, function () {
        it('should return 400 and validation errors', function (done) {
          chai
            .request(app)
            .post('/sessions')
            .send(credentials)
            .end((err, res) => {
              expect(res).to.have.status(400)
              expect(res.body.error).to.equal(errors.join(','))
              done()
            })
        })
      })
    })
  })

  context('with valid credentials not matching a user', function () {
    [
      { email: 'jsilver@jsilver.com', password: '12345678' },
      { email: 'jsilver@jsilver.com', password: 'PASSWORD' }
    ].map((credentials) => {
      const { email, password } = credentials

      context(`${email}:${password}`, function () {
        it('should return 401 and authentication error', function (done) {
          chai
            .request(app)
            .post('/sessions')
            .send(credentials)
            .end((err, res) => {
              expect(res).to.have.status(401)
              expect(res.body.error).to.equal('authentication failed')
              done()
            })
        })
      })
    })
  })

  context('with valid credentials matching a user', function () {
    [
      { email: 'jsilver@jsilver.com', password: 'password', name: 'J. Silver' },
      { email: 'hstevens@hstevens.com', password: '12345678', name: 'H. Stevens' }
    ].map((validCredentials) => {
      const { email, password, name } = validCredentials

      context(`${email}:${password}`, function () {
        it('should return 200; user id and name in body; token in HTTP cookie', function (done) {
          chai
            .request(app)
            .post('/sessions')
            .send({
              email: email,
              password: password
            })
            .end((err, res) => {
              expect(res).to.have.status(201)
              expect(res).to.have.cookie('token')
              expect(res.body.data.id).to.be.not.empty
              expect(res.body.data.name).to.equal(name)
              done()
            })
        })
      })
    })
  })
})

describe('DELETE /sessions', function () {
  context('when token invalid', function () {
    it('should return 401 and not token cookie', function (done) {
      chai
        .request(app)
        .delete('/sessions')
        .set('Cookie', 'token=invalid-token')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res).to.have.status(401)
          expect(res).to.not.have.cookie('token')
          done()
        })
    })
  })

  context('when token valid', function () {
    it('should return 200 and no token cookie', function (done) {
      chai
        .request(app)
        .delete('/sessions')
        .set(
          'Cookie',
          'token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZjBjNmVhYjNhNTcwYzczMGJhZTczNCIsIm5hbWUiOiJKLiBTaWx2ZXIiLCJpYXQiOjE1OTI4NDkzOTIsImF1ZCI6ImNhc2VsYWJlbHMtdWkiLCJpc3MiOiJjYXNlbGFiZWxzLmlvIiwic3ViIjoiNWVmMGM2ZWFiM2E1NzBjNzMwYmFlNzM0In0.aiNiCYFfS_Qv_0Nz86AMPwbB-uzUh2XKU-vnmDLXe_ZnjqgoegIn-1NMPZpmCUpczsZ9dAPU05_SiLLak7fEomLvL9hegVpwb6_mrNjlbUENcXcNXHozwnTzbKpg0sh4mlwy-mT5zeYUJm71xuK998jokQ2dOcsluFnoFbmvaecwuQV-m9OIqZxK0ZCQx6u9NfEnH-NSf_w7dPgAOyS3UxLu3oRdgSWm7tZar2ws8iF5KDP_R4cLt6H5mKLwEOPBkxwkYJlqprVLj1XCLTeQEfhz5C8F4JWYjsT4WRxc-mYiPEckhwEA3b_fIXevhN0lHBbua_iWcwkNZI_1GhuGPPP1ffNQlI5o80C0BEe-gAhnWMWdAYyEyAVJSMLtAVLFS5EVZ8LYvHOuzidyrwqgb38FrZmQx8ma2x1nYPy4b139f_SjUtj_vZZZZpic6UyzKHHfybkaE8wdOP33aJkUpRrMjV53ymZV1w7c9_IA4VYgBuZ1VOMqY9Z2uPg9n00q0afkEJX7pjdhS5rsE3F2sweg11gE5i0B9VKIeE0rgw5NYopn3uolo8uz5IcJH1RWMr6j70xgl0TKar5roJvSMYVBDo805FOrqcmSTtL5LEBx6VkuYOpVowPJrZL2Xh1aphd6lCTxWtNDtCCakMobUxibi0gRI-p3aVkems9pfSw'
        )
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res).to.not.have.cookie('token')
          done()
        })
    })
  })
})
