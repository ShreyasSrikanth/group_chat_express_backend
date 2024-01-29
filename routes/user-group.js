const path = require('path');
const express = require('express');
const Router = express.Router();

const authUser = require('../middlewear/auth');
const groupController = require('../controllers/user-group');

Router.post('/createGroups',authUser.authentication,groupController.createGroups);
Router.get('/fetchgroups',authUser.authentication,groupController.fetchGroups);
Router.get('/fetchgroupusers',groupController.fetchGroupUsers);
Router.post('/removegroupuser',authUser.authentication,groupController.removeGroupUser)
Router.get('/fetchnewusers',groupController.fetchInviteUsers);
Router.post('/addusertogroup',authUser.authentication,groupController.addUserToGroup)

module.exports = Router;