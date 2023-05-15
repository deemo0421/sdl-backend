const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Phase = require('./phase');

const Process = sequelize.define('process', {
    phase: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull:false,
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false,
    }
});
Process.hasMany(Phase);

module.exports = Process;
