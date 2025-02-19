const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const NoteCard = sequelize.define("NoteCard", {
  enText: {
    type: DataTypes.STRING
  },
  deText: {
    type: DataTypes.STRING
  },
}, {
  timestamps: true
});

module.exports = NoteCard
