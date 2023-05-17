const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Idea_wall = require('./idea_wall');
const Tag = require('./tag');
const Process = require('./process');
const Daily_personal = require('./daily_personal');
const Daily_team = require('./daily_team');
const Chatroom_message = require('./chatroom_message');
const Kanban = require('./kanban');

const Project = sequelize.define('project', {
    name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    describe: {
        type: DataTypes.STRING,
        allowNull:false
    },
    mentor: {
        type: DataTypes.STRING,
        allowNull:false
    },
});

Project.hasMany(Chatroom_message);
Project.hasMany(Tag);
Project.hasMany(Idea_wall);
Project.hasMany(Process);
Project.hasMany(Daily_personal);
Project.hasMany(Daily_team);
Project.hasOne(Kanban);

module.exports = Project;