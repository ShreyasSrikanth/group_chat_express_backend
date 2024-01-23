const sequelize = require("sequelize");
const database = require("../util/database");

const archived = database.define('archivedChat',{
    id:{
        type: sequelize.INTEGER,
        autoIncrement: true,
        autoNull: false,
        primaryKey:true
    },
    message:{
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

module.exports = archived;