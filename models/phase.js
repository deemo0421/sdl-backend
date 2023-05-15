const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Sub_phase = require('./sub_phase');

const Phase = sequelize.define('phase', {
    name: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    sub_phase:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull:false,
    }
});
Phase.hasMany(Sub_phase);

module.exports = Phase;