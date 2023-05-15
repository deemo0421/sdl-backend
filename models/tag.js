const {DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Tag = sequelize.define('tag', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false
    }, 
    bg_color: {
        type: DataTypes.STRING,
        allowNull:false
    },
    text_color: {
        type: DataTypes.STRING,
        allowNull:false
    },   
});
module.exports = Tag;
