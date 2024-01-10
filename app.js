const path = require('path');
const cors = require('cors');
const express = require('express');
const fs = require('fs')

const userModel = require('./models/signupModel');
const messageModel = require("./models/messageModel");
const groupModel = require("./models/groupModel");
const groupmessagesModel = require('./models/groupMessageModel'); 
const groupAdminModel = require('./models/groupAdminModel'); 

const app = express();
const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./util/database');
const bodyParser = require('body-parser');

const signupRoute = require('./routes/signUpRoute');
const messageRoute = require('./routes/messageRoute');
const groupRoute = require('./routes/groupRoute');
const groupmessageRoute = require('./routes/groupmessageRoute');
const groupAdminRoute = require('./routes/groupAdminRoute');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}
  );

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use('/users',signupRoute);
app.use('/message',messageRoute);
app.use('/groups',groupRoute);
app.use('/groupmessageRoute',groupmessageRoute);
app.use('/groupAdminRoute',groupAdminRoute);

userModel.hasMany(messageModel);
messageModel.belongsTo(userModel);

userModel.belongsToMany(groupModel, { through: 'UserGroup' });
groupModel.belongsToMany(userModel, { through: 'UserGroup' });

userModel.hasMany(groupmessagesModel);
groupmessagesModel.belongsTo(userModel);

groupModel.hasMany(groupmessagesModel);
groupmessagesModel.belongsTo(groupModel);

groupModel.hasMany(groupAdminModel);
groupAdminModel.belongsTo(groupModel);

sequelize.sync()
  .then(res => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });