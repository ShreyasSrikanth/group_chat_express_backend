const path = require('path');
const express = require('express');
const Router = express.Router();

const authUser = require('../middlewear/auth');
const groupAdminController = require('../controllers/groupAdminController');



module.exports = Router;