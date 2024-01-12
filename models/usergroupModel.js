const sequelize = require('sequelize')
const database = require('../util/database');

const usergroups = database.define('usergroups',{
});

module.exports = usergroups;