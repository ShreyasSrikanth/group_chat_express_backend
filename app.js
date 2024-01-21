const path = require('path');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const http = require('http'); // Add this line

const userModel = require('./models/signupModel');
const messageModel = require("./models/messageModel");
const groupModel = require("./models/groupModel");
const groupmessagesModel = require('./models/groupMessageModel'); 
const groupAdminModel = require('./models/groupAdminModel'); 

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = require('socket.io')(server); // Attach socket.io to the server

const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./util/database');
const bodyParser = require('body-parser');

const signupRoute = require('./routes/signUpRoute');
const messageRoute = require('./routes/messageRoute');
const groupRoute = require('./routes/groupRoute');
const groupmessageRoute = require('./routes/groupmessageRoute');
const groupAdminRoute = require('./routes/groupAdminRoute');


const multer = require('multer');
const uploadF = multer({dest: 'uploads/'})

app.post('/file/upload',uploadF.single('file'), (req,res) =>{
  console.log("buffer")
  console.log("req.user.userId")

  res.send("Upload succesfull")
}) 

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}
);

// app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use('/users',signupRoute);
app.use('/message',messageRoute);
app.use('/groups',groupRoute);
app.use('/groupmessageRoute',groupmessageRoute);
app.use('/groupAdminRoute',groupAdminRoute);

userModel.hasMany(messageModel);
messageModel.belongsTo(userModel);

userModel.belongsToMany(groupModel, { through: 'usergroups' });
groupModel.belongsToMany(userModel, { through: 'usergroups' });

userModel.hasMany(groupmessagesModel);
groupmessagesModel.belongsTo(userModel);

groupModel.hasMany(groupmessagesModel);
groupmessagesModel.belongsTo(groupModel);

groupModel.hasMany(groupAdminModel);
groupAdminModel.belongsTo(groupModel);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/Login/login.html');
});

app.get('/:dynamicRoute', (req, res) => {
  const dynamicRoute = req.params.dynamicRoute;
  res.send(`Dynamic Route: ${dynamicRoute}`);
});

io.on("connection", socket => {
  socket.on("send",(message)=>{
    io.emit('newmessagestored',message)
  })

  socket.on("sendGroupMessages",(message)=>{
    io.emit('newgroupmessagesstored',message)
  })

  socket.on("creatinggroup", (groupName)=>{
    console.log(groupName)
    io.emit('groupcreated',groupName)
  })
});


sequelize.sync()
  .then(res => {
    server.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch(err => {
    console.log(err);
  });
