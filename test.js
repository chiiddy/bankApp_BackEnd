import chai from "chai";
import chaiHttp from "chai-http";
import app from "./index.js";
// import mongoose from "mongoose";

chai.use(chaiHttp);
const expect = chai.expect;

describe('Transactions API', () => {
  // Define a user token to use in the Authorization header
  let userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MDQxOTQ3NGY3NTgxYmE4ZTMzNjg3NyIsInBob25lTnVtYmVyIjoiMDgwMzgzNDA3Nzk5IiwiaWF0IjoxNjk0NzY3NDQ4LCJleHAiOjE2OTQ3NzgyNDh9.nRmjB2STm0AM7u3ktV07MD-1Ib_85f2MNloSwT-9ZAA';

  before(async () => {
     // Perform any setup steps here, like user authentication and obtaining a token.
    // You can use a testing library like supertest to authenticate and obtain a token.
    // Store the token in the userToken variable.
  });

  it('should deposit funds into the user account', (done) => {
    chai
      .request(app)
      .post('/api/deposit')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ userId: '650402acc44f13ce5a38eef7', amount: 100 }) // Replace with valid user ID
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Deposit successful');
        done();
      });
      done();
  });

  it('should withdraw funds from the user account', (done) => {
    chai
      .request(app)
      .post('/api/withdraw')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ userId: '650402acc44f13ce5a38eef7', amount: 50 }) // Replace with valid user ID
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Withdrawal successful');
        done();
      });
      done();
  });

  // Add more test cases as needed

  after(async () => {
   
    // resetApplicationState();
  });
});