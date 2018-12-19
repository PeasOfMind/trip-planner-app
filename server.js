'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { router: tripRouter } = require('./trips');
const { router: authRouter, localStrategy, jwtStrategy} = require('./auth');
const { router: usersRouter} = require('./users');

app.use(express.static('public'));
app.use(morgan('common'));

app.use(express.json());

//CORS
app.use(cors());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);  

app.use('/api/trips', tripRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it -- DELETE after testing
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(databaseUrl, port = PORT){
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if(err){
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer(){
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if(err) {
                    return reject(err);
                }
                resolve();
            })
        })
    })
}

if (require.main === module){
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};