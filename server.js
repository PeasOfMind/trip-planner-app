"use strict";

const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.static('public'));
app.use(morgan('common'));

// app.get('/dashboard', (req, res) => {
//     res.status(200).send('public/dashboard.html');
// })

app.listen(process.env.PORT || 8080);


module.exports = {app};