const path = require('path');
const express = require('express');
const Router = express.Router();

const authUser = require('../middlewear/auth');
const groupMessaageController = require('../controllers/groupMessaageController');

Router.post('/fetchgroupUsers',authUser.authentication,groupMessaageController.postGroupMessages);
Router.get('/fetchgroupmessages',authUser.authentication,groupMessaageController.getNewGroupMessages)
Router.get('/fetchallgroupmessages',authUser.authentication,groupMessaageController.getAllMessages)

module.exports = Router;