const chai = require('chai')
const chaiHttp = require('chai-http')

const app = require('../../src/app')

const { expect, use } = chai

use(chaiHttp)

describe('GET /labels', function () {
  context('when token invalid', function () {
    it('should return 401', function (done) {
      chai
        .request(app)
        .get('/labels')
        .set('Authorization', 'Bearer invalid-token')
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.body).to.be.empty
          done()
        })
    })
  })

  context('when token valid', function () {
    it('should return 200 and labels in the body', function (done) {
      chai
        .request(app)
        .get('/labels')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYzAxNDNjNWFiMWY4MzRkYWJjN2U1MSIsIm5hbWUiOiJKLiBTaWx2ZXIiLCJpYXQiOjE1ODk2NDY0MDl9.DtOdCJS3xyru_3jCwsnFUEqmhk1AHsaSZ339Vra_OyI'
        )
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.not.be.empty
          done()
        })
    })
  })
})
