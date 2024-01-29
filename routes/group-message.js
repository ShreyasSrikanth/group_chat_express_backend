const path = require('path');
const express = require('express');
const Router = express.Router();

const authUser = require('../middlewear/auth');
const groupMessaageController = require('../controllers/group-message');

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

Router.post('/fetchgroupusers',authUser.authentication,groupMessaageController.postGroupMessages);
Router.get('/fetchgroupmessages',authUser.authentication,groupMessaageController.getNewGroupMessages)
Router.get('/fetchallgroupmessages',authUser.authentication,groupMessaageController.getAllMessages)
Router.post('/filesupload',upload.single('file'),authUser.authentication,groupMessaageController.filesUpload)

module.exports = Router;