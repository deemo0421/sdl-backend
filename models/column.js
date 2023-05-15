const {DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Task = require('./task');

const Column = sequelize.define('column', {
    name: {
        type: DataTypes.STRING,
        allowNull:false
    }, 
    task: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull:true
    },  
});

Column.hasMany(Task);
module.exports = Column;