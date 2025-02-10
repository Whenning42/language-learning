const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Tutorial = sequelize.define("User", {
  title: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  published: {
    type: DataTypes.BOOLEAN
  },
}, {
  timestamps: true
});

module.exports = Tutorial
