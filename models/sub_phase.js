const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Sub_phase = sequelize.define('sub_phase', {
    name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    discription:{
        type: DataTypes.STRING,
        allowNull:false
    },
    userSubmit:{
        type: DataTypes.JSON,
        allowNull:false
    }
});

module.exports = Sub_phase;