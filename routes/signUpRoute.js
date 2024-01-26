const path = require('path');
const express = require('express');
const Router = express.Router();

const signupController = require('../controllers/signupController');
const authUser = require('../middlewear/auth');

Router.post('/signup',signupController.postItem);
Router.post('/login',signupController.loginCredentials);
Router.get('/fetchusers',authUser.authentication,signupController.findnewUsers);

module.exports = Router;