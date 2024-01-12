const sequelize = require('sequelize')
const database = require('../util/database');

const usergroups = database.define('usergroups',{
    idd:{
        type:sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
});

module.exports = usergroups;