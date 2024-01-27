const sequelize = require('sequelize');
const database = require('../util/database');

const users = database.define('Users', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: sequelize.STRING,
        allowNull: false
    },
    pass: {
        type: sequelize.STRING,
        allowNull: false
    }
});

module.exports = users;
