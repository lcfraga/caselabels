const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiString = require('chai-string')

const { app } = require('../../src')

const { expect, use } = chai

use(chaiHttp)
use(chaiString)

describe('content type enforcement', function () {
  context('with invalid content type', function () {
    [
      '/caselabels',
      '/users/login',
      '/users/logout'
    ].map(path => {
      [
        'application/x-www-form-urlencoded',
        'multipart/form-data',
        'text/plain'
      ].map(invalidContentType => {
        context(`POST ${path} with content type ${invalidContentType}`, function () {
          it('should return 415', function (done) {
            chai
              .request(app)
              .post(path)
              .set('Content-Type', invalidContentType)
              .send('{}')
              .end((err, res) => {
                expect(res).to.have.status(415)
                expect(res.body).to.be.empty
                done()
              })
          })
        })
      })
    })
  })

  context('with valid content type', function () {
    [
      '/caselabels',
      '/users/login',
      '/users/logout'
    ].map(path => {
      context(`POST ${path} with content type application/json`, function () {
        it('should return 401', function (done) {
          chai
            .request(app)
            .post(path)
            .set('Content-Type', 'application/json')
            .send({})
            .end((err, res) => {
              expect(res).to.have.status(401)
              expect(res.body).to.be.empty
              done()
            })
        })
      })
    })
  })
})
