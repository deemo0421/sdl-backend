const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Chatroom_message = sequelize.define('Chatroom_message', {
    message:{
        type: DataTypes.STRING,
        allowNull:true
    }
});

module.exports = Chatroom_message;