const path = require('path');
const express = require('express');
const Router = express.Router();

const authUser = require('../middlewear/auth');
const groupController = require('../controllers/groupController');

Router.post('/createGroups',authUser.authentication,groupController.createGroups);
Router.get('/fetchgroups',authUser.authentication,groupController.fetchGroups);
Router.get('/fetchgroupUsers',groupController.fetchGroupUsers);

module.exports = Router;