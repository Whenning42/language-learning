const sequelize = require("./index.js");
const noteCard = require("../app/models/note_card");

async function initializeDatabase() {
  try {
    await sequelize.sync({force: false});
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
}

module.exports = initializeDatabase;
