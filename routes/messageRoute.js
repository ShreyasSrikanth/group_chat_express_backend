const path = require('path');
const express = require('express');
const Router = express.Router();

const messageController = require('../controllers/messageController');
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
Router.get('/getNewMessage',authUser.authentication,messageController.getNewMessages);
Router.post('/filesUpload',upload.single('file'),messageController.filesUpload)


module.exports = Router;