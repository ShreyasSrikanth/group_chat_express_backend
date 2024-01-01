const path = require('path');
const express = require('express');
const Router = express.Router();

const signupController = require('../controllers/signupController');

Router.post('/signup',signupController.postItem);

module.exports = Router;