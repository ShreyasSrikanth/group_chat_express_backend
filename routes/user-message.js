const path = require('path');
const express = require('express');
const Router = express.Router();

const messageController = require('../controllers/user-message');
const authUser = require('../middlewear/auth');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./uploads');
    },
    filename: function (req,file,cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

Router.post('/storechat',authUser.authentication,messageController.postMessages);
Router.get('/getmessages',authUser.authentication,messageController.getMessages);
Router.get('/getnewmessage',authUser.authentication,messageController.getNewMessages);
Router.post('/filesupload',upload.single('file'),authUser.authentication,messageController.filesUpload)


module.exports = Router;