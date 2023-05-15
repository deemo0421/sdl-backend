const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Node = require('./node');

const Idea_wall = sequelize.define('idea_wall', {
    name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    type:{
        type: DataTypes.STRING,
        allowNull:false
    }
});
Idea_wall.hasMany(Node);

module.exports = Idea_wall;


