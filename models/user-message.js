const sequelize = require("sequelize");
const database = require("../util/database");

const Message = database.define('messages',{
    id:{
        type: sequelize.INTEGER,
        autoIncrement: true,
        autoNull: false,
        primaryKey:true
    },
    text:{
        type:sequelize.STRING,
        autoNull:false
    },
    createdAt:{
        type:sequelize.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
    },
    updatedAt:{
        type: sequelize.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    fileUrl: sequelize.STRING
})

module.exports = Message;