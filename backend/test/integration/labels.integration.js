const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../../app');
const expect = chai.expect;

describe('GET /labels', () => {
  context('when token invalid', () => {
    it('should return 401', (done) => {
      chai
        .request(app)
        .get('/labels')
        .set('Authorization', 'Bearer invalid-token')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.empty;
          done();
        });
    });
  });

  context('when token valid', () => {
    it('should return 200 and labels in the body', (done) => {
      chai
        .request(app)
        .get('/labels')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYzAxNDNjNWFiMWY4MzRkYWJjN2U1MSIsIm5hbWUiOiJKLiBTaWx2ZXIiLCJpYXQiOjE1ODk2NDY0MDl9.DtOdCJS3xyru_3jCwsnFUEqmhk1AHsaSZ339Vra_OyI'
        )
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.not.be.empty;
          done();
        });
    });
  });
});
