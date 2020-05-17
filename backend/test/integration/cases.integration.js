const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiString = require('chai-string');
chai.use(chaiHttp);
chai.use(chaiString);
const app = require('../../app');
const expect = chai.expect;

describe('GET /cases/next', () => {
  context('when token invalid', () => {
    it('should return 401', (done) => {
      chai
        .request(app)
        .get('/cases/next')
        .set('Authorization', 'Bearer invalid-token')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.empty;
          done();
        });
    });
  });

  context('when token invalid', () => {
    it('should return 200 and case in the body', (done) => {
      chai
        .request(app)
        .get('/cases/next')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYzAxNDNjNWFiMWY4MzRkYWJjN2U1MSIsIm5hbWUiOiJKLiBTaWx2ZXIiLCJpYXQiOjE1ODk2NDY0MDl9.DtOdCJS3xyru_3jCwsnFUEqmhk1AHsaSZ339Vra_OyI'
        )
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.id).to.equal('5ec0143c33e39fa6bb2bdfd1');
          expect(res.body.content).to.startWith(
            'Patient  is an 45 year old  female.'
          );
          done();
        });
    });
  });
});
