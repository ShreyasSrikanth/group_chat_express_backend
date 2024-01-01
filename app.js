const path = require('path');
const cors = require('cors');
const express = require('express');
const fs = require('fs')

const userModel = require('./models/signupModel');

const app = express();
const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const signupRoute = require('./routes/signUpRoute');


const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}
  );


app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use('/users',signupRoute);


sequelize.sync()
  .then(res => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });