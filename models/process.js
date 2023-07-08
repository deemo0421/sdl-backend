const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Phase = require('./phase');

const Process = sequelize.define('process', {
    phase: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull:false,
    },
    name:{
        type: DataTypes.TEXT,
        allowNull:false,
    }
});
Process.hasMany(Phase);

module.exports = Process;
