const config = require("../config/database.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: "mariadb",
    port: config.development.port,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful.");
  } catch (error) {
    console.error("Unable to connect to db:", error);
  }
}

testConnection();

module.exports = sequelize;
