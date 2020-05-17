const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../../app');
const expect = chai.expect;

describe('POST /users/login', () => {
  [
    {},
    { email: 'jsilver@hospital.com', password: '' },
    { email: '', password: 'password' },
    { email: 'jsilver@hospital.com', password: '12345678' },
  ].map((invalidCredentials) => {
    const { email, password } = invalidCredentials;

    context(`with invalid credentials ${email}:${password}`, () => {
      it('should return 401', (done) => {
        chai
          .request(app)
          .post('/users/login')
          .send(invalidCredentials)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.be.empty;
            done();
          });
      });
    });
  });

  [
    { email: 'jsilver@hospital.com', password: 'password' },
    { email: 'hstevens@clinic.com', password: '12345678' },
  ].map((validCredentials) => {
    const { email, password } = validCredentials;

    context(`with valid credentials ${email}:${password}`, () => {
      it('should return 200 and user id, name and token in body', (done) => {
        chai
          .request(app)
          .post('/users/login')
          .send({
            email: 'jsilver@hospital.com',
            password: 'password',
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.id).to.equal('5ec0143c5ab1f834dabc7e51');
            expect(res.body.name).to.equal('J. Silver');
            expect(res.body.token).to.be.not.empty;
            done();
          });
      });
    });
  });
});
