const sequelize = require('sequelize')
const database = require('../util/database');

const userGroups = database.define('groups',{
    id:{
        type:sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    groupname:sequelize.STRING,
    groupadminId:sequelize.INTEGER
});

module.exports = userGroups;