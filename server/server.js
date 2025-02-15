require('dotenv').config();
const express = require("express");
const initializeDatabase = require("./db/init")
const cors = require("cors");
const tutorialRoutes = require("./routes/tutorials");

const NO_CACHE = process.env.NO_CACHE === "true";
if (NO_CACHE) {
  console.log("Forcing no cache on static cache.");
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

initializeDatabase();

app.use("/api", tutorialRoutes);

const setNoStoreHeader = (req, res, next) => {
    if (NO_CACHE) {
        res.set('Cache-Control', 'no-store');
    }
    next();
};
app.use("/videos", setNoStoreHeader, express.static("videos"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
