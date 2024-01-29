const database = require('../util/database');
const sequelize = require('sequelize');

const groupAdmin = database.define('groupadmin',{
    id:{
        type: sequelize.INTEGER,
        autoIncrement: true,
        autoNull: false,
        primaryKey:true
    },
    groupadminId:{
        type: sequelize.INTEGER,
        autoIncrement: false,
        autoNull: false,
        primaryKey:false
    },
});

module.exports=groupAdmin;