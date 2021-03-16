const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')

const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));


app.use('/test-api/v1/user',userRoutes);



module.exports = app;