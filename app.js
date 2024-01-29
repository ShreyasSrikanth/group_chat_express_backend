const path = require('path');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const http = require('http');

const userModel = require('./models/user-sign-up');
const messageModel = require("./models/user-message");
const groupModel = require("./models/group-creation");
const groupmessagesModel = require('./models/group-message');
const groupAdminModel = require('./models/group-admin');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);


const sequelize = require('./util/database');
const bodyParser = require('body-parser');

const signupRoute = require('./routes/sign-up');
const messageRoute = require('./routes/user-message');
const groupRoute = require('./routes/user-group');
const groupmessageRoute = require('./routes/group-message');



const multer = require('multer');
const uploadF = multer({
    dest: 'uploads/'
});


const archivedChatController = require('./controllers/archived-chat');

const cron = require('cron');
const scheduledJob = new cron.CronJob('0 0 * * *', function() {
    archivedChatController.moveAndDeleteMessages()
});

scheduledJob.start();

app.post('/file/upload', uploadF.single('file'), (req, res) => {
    console.log("buffer")
    console.log("req.user.userId")
    res.send("Upload succesfull")
})

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), {
        flags: 'a'
    }
);

// app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.json());
app.use('/users', signupRoute);
app.use('/message', messageRoute);
app.use('/groups', groupRoute);
app.use('/groupmessageRoute', groupmessageRoute);

userModel.hasMany(messageModel);
messageModel.belongsTo(userModel);

userModel.belongsToMany(groupModel, {
    through: 'usergroups'
});
groupModel.belongsToMany(userModel, {
    through: 'usergroups'
});

userModel.hasMany(groupmessagesModel);
groupmessagesModel.belongsTo(userModel);

groupModel.hasMany(groupmessagesModel);
groupmessagesModel.belongsTo(groupModel);

groupModel.hasMany(groupAdminModel);
groupAdminModel.belongsTo(groupModel);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/login/login.html');
});

app.get('/:dynamicRoute', (req, res) => {
    const dynamicRoute = req.params.dynamicRoute;
    res.send(`Dynamic Route: ${dynamicRoute}`);
});

io.on("connection", socket => {
    socket.on("send", (message) => {
        io.emit('newmessagestored', message)
    })

    socket.on("sendfile", (selectedFile) => {
        io.emit('fileSent', selectedFile)
    })

    socket.on("sendGroupMessages", (message) => {
        io.emit('newgroupmessagesstored', message)
    })

    socket.on("sendGroupFile", (message) => {
        io.emit('filesentingroup', message)
    })

    socket.on("creatinggroup", (groupName) => {
        io.emit('groupcreated', groupName)
    })
});


sequelize.sync()
    .then(res => {
        server.listen(3000, () => {
            console.log('Server running on http://3.87.172.140:3000');
        });
    })
    .catch(err => {
        console.log(err);
    });