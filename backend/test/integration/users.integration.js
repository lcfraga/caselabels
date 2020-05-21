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
    { email: 'jsilver@hospital.com', password: '12345678' }
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
    { email: 'jsilver@hospital.com', password: 'password', name: 'J. Silver' },
    { email: 'hstevens@clinic.com', password: '12345678', name: 'H. Stevens' }
  ].map((validCredentials) => {
    const { email, password, name } = validCredentials;

    context(`with valid credentials ${email}:${password}`, () => {
      it('should return 200 and user id, name and token in body', (done) => {
        chai
          .request(app)
          .post('/users/login')
          .send({
            email: email,
            password: password
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.id).to.be.not.empty;
            expect(res.body.name).to.equal(name);
            expect(res.body.token).to.be.not.empty;
            done();
          });
      });
    });
  });
});
