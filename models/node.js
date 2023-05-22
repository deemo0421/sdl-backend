const { DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Node = sequelize.define('node', {
    title: {
        type: DataTypes.STRING,
        allowNull:false
    },
    content:{
        type: DataTypes.STRING,
        allowNull:false
    },
    owner:{
        type: DataTypes.STRING,
        allowNull:false
    }
});

Node.belongsToMany(Node, {as:"from_id" , through:"Node_Relation"});
Node.belongsToMany(Node, {as:"to_id" , through:"Node_Relation"});

module.exports = Node;