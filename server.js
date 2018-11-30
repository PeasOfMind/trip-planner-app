'use strict';

const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.static('public'));
app.use(morgan('common'));

app.listen(process.env.PORT || 8080);


module.exports = {app};