const path = require('path');
const express = require('express');
const Router = express.Router();

const messageController = require('../controllers/messageController');
const authUser = require('../middlewear/auth');

Router.post('/storechat',authUser.authentication,messageController.postMessages);


module.exports = Router;