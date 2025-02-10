const  Sequelize = require('sequelize');
const { SqliteDialect } = require('@sequelize/sqlite3');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'project.db',
});

module.exports = sequelize;
