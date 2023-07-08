const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Sub_phase = sequelize.define('sub_phase', {
    name: {
        type: DataTypes.TEXT,
        allowNull:false
    },
    discription:{
        type: DataTypes.TEXT,
        allowNull:false
    },
    userSubmit:{
        type: DataTypes.JSON,
        allowNull:false
    }
});

module.exports = Sub_phase;