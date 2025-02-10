const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

// Backend endpoints.
exports.create = (req, res) => {
  console.log("Create:" + req);
};

exports.update = (req, res) => {
  console.log("Update:" + req);
};

exports.delete = (req, res) => {
  console.log("Delete:" + req);
};
