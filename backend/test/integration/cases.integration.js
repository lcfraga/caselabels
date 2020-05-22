const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiString = require('chai-string')

const app = require('../../app')

const { expect, use } = chai

use(chaiHttp)
use(chaiString)

describe('GET /cases/next', function () {
  context('when token invalid', function () {
    it('should return 401', function (done) {
      chai
        .request(app)
        .get('/cases/next')
        .set('Authorization', 'Bearer invalid-token')
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.body).to.be.empty
          done()
        })
    })
  })

  context('when token valid', function () {
    it('should return 200 and case in the body', function (done) {
      chai
        .request(app)
        .get('/cases/next')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYzAxNDNjNWFiMWY4MzRkYWJjN2U1MSIsIm5hbWUiOiJKLiBTaWx2ZXIiLCJpYXQiOjE1ODk2NDY0MDl9.DtOdCJS3xyru_3jCwsnFUEqmhk1AHsaSZ339Vra_OyI'
        )
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.id).to.be.not.empty
          expect(res.body.content).to.startWith(
            'Patient  is an 45 year old  female.'
          )
          done()
        })
    })
  })
})
