const {DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const Project = require('./project');
const Threads = require('./threads');
const Threads_Message = require('./threads_message');

const User = sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull:false
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false
    },
    role: {
        type: DataTypes.STRING,
        allowNull:false
    },  
});


User.belongsToMany(Project, {through:"User_Project"});
Project.belongsToMany(User, {through:"User_Project"});

User.hasMany(Threads_Message);
User.hasMany(Threads);

module.exports = User;