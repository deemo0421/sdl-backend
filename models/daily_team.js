const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Daily_team = sequelize.define('daily_team', {
    stage: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    title:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    content:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    filename:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    type:{
        type: DataTypes.STRING,
        allowNull:false,
    }
});

module.exports = Daily_team;