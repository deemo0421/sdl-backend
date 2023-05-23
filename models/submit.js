const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Submit = sequelize.define('submit', {
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
});

module.exports = Submit;