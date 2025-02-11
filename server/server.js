const express = require("express");
const initializeDatabase = require("./db/init")
const cors = require("cors");
const tutorialRoutes = require("./routes/tutorials");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

initializeDatabase();

app.use("/api", tutorialRoutes);
app.use("/videos", express.static("videos"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
