// connection postgres
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'dev',
    'wulab',
    'password',
    {
        host: 'localhost',
        dialect:'postgres',
    },
    
);

module.exports = sequelize;