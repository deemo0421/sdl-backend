const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Daily_personal = sequelize.define('daily_personal', {
    title:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    content:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    filename:{
        type: DataTypes.TEXT,
        allowNull:false,
    },
    filepath:{
        type: DataTypes.TEXT,
        allowNull:false,
    }
});

module.exports = Daily_personal;
