'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/user', function(){
    const username = 'exampleUser';
    const password = 'examplePass123';

    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    after(function(){
        return closeServer();
    });

    beforeEach(function(){});

    afterEach(function(){
        return User.remove({});
    });

    describe('/api/users', function(){
        describe('POST', function(){
            it.only('Should reject users with missing username', function(){
                return chai.request(app)
                .post('/api/users')
                .send({password})
                .then((res) => {
                    // const res = err.response;
                    console.log('the res is:',res.body);
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('username');
                    // expect.fail(null, null, 'Request should not succeed');
                });
                // .catch(err => {
                //     console.log('the err is:', err);
                //     if(err instanceof chai.AssertionError){
                //         console.log('the err is an assertionError');
                //         throw err;
                //     }
                // });
            });

            it('Should reject users with missing password', function(){
                return chai.request(app)
                .post('/api/users')
                .send({username})
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch(err => {
                    if(err instanceof chai.AssertionError){
                        throw err;
                    }
                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('password');
                });
            });

            it('Should reject users with non-string username', function(){
                return chai.request(app)
                .post('/api/users')
                .send({username: 1234, password})
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch(err => {
                    if (err instanceof chai.AssertionError){
                        throw err;
                    }
                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected string');
                    expect(res.body.location).to.equal('username');
                });
            });
            
            it('Should reject users with non-string password', function(){
                return chai.request(app)
                .post('/api/users')
                .send({username, password: 1234})
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch(err => {
                    if (err instanceof chai.AssertionError){
                        throw err;
                    }
                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected string');
                    expect(res.body.location).to.equal('password');
                });
            });

            it('Should reject users with non-trimmed username', function(){
                return chai.request(app)
                .post('/api/users')
                .send({username: ` ${username}  `, password})
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch(err => {
                    if (err instanceof chai.AssertionError){
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Cannot start or end with whitespace');
                    expect(res.body.location).to.equal('username');
                });
            });
            
            it('Should reject users with non-trimmed password', function(){
                return chai.request(app)
                .post('/api/users')
                .send({username, password: ` ${password}  `})
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch(err => {
                    if (err instanceof chai.AssertionError){
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Cannot start or end with whitespace');
                    expect(res.body.location).to.equal('password');
                });
            });

            it('Should reject users with username less than 2 characters', function(){
                return chai.request(app)
                .post('/api/users')
                .send({username: '', password})
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch(err => {
                    if (err instanceof chai.AssertionError){
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('username must be at least 2 characters');
                    expect(res.body.location).to.equal('username');
                });
            });


            it('Should reject users with password less than 8 characters', function(){
                return chai.request(app)
                .post('/api/users')
                .send({username, password: 'abc456'})
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch(err => {
                    if (err instanceof chai.AssertionError){
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('password must be at least 8 characters');
                    expect(res.body.location).to.equal('password');
                });
            });

            it('Should reject users with password greater than 72 characters', function(){
                return chai.request(app)
                .post('/api/users')
                .send({username, password: new Array(73).fill('a').join('')})
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch(err => {
                    if (err instanceof chai.AssertionError){
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('password must be at most 72 characters');
                    expect(res.body.location).to.equal('password');
                });
            });

            it('Should reject users with duplicate username', function(){
                //create initial user
                return User.create({username, password})
                .then(() => chai.request(app).post('/api/users').send({username, password}))
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch(err => {
                    if (err instanceof chai.AssertionError){
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Username already taken');
                    expect(res.body.location).to.equal('username');
                });
            });

            it('Should create a new user', function(){
                return chai.request(app)
                .post('/api/users')
                .send({username, password})
                .then(res => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body.username).to.exist;
                    expect(res.body.username).to.equal(username);
                    return User.findOne({username})
                })
                .then(user => {
                    expect(user).to.not.be.null;
                    return user.validatePassword(password);
                })
                .then(passwordIsCorrect => {
                    expect(passwordIsCorrect).to.be.true;
                });
            });

        });
    });
});