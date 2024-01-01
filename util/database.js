const Sequelize = require('sequelize');
require('dotenv').config();

const sequelise = new Sequelize("group-chat","root","root",{
    dialect: 'mysql',
    host: "localhost",
    timezone: '+05:30'
});

module.exports = sequelise;