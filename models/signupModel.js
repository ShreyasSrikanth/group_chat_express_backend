const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const items = sequelize.define('Users',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey: true
    },
    name:{
        type:Sequelize.STRING,
        autoIncrement : false,
        allowNull : false,
        primaryKey: false
    },
    email:{
        type:Sequelize.STRING,
        autoIncrement : false,
        allowNull : false,
        primaryKey: false
    },
    phone:{
        type:Sequelize.INTEGER,
        autoIncrement : false,
        allowNull : false,
        primaryKey: false
    },
    pass:{
        type:Sequelize.STRING,
        autoIncrement : false,
        allowNull : false,
        primaryKey: false
    }
});

module.exports = items;