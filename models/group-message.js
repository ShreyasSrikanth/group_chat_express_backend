const database = require('../util/database');
const sequelize = require('sequelize');

const groupMessages = database.define('groupmessages',{
    id:{
        type: sequelize.INTEGER,
        autoIncrement: true,
        autoNull: false,
        primaryKey:true
    },
    text:sequelize.STRING,
    fileUrl: sequelize.STRING
});

module.exports=groupMessages;