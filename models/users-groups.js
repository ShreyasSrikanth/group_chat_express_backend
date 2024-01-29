const sequelize = require('sequelize')
const database = require('../util/database');

const userGroups = database.define('usergroups',{
});

module.exports = userGroups;