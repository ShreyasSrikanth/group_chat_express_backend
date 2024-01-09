const database = require('../util/database');
const sequelize = require('sequelize');

const groupmessages = database.define('groupmessages',{
    id:{
        type: sequelize.INTEGER,
        autoIncrement: true,
        autoNull: false,
        primaryKey:true
    },
    message:sequelize.STRING
});

module.exports=groupmessages;