const express = require("express");
const router = express.Router();
const Tutorial = require("../app/models/tutorial");

router.post("/tutorials", async (req, res) => {
  try {
    const tutorial = await Tutorial.create(req.body);
    res.status(201).json(tutorial);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});


router.get("/tutorials", async (req, res) => {
  try {
    const tutorials = await Tutorial.findAll();
    res.json(tutorials);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

router.delete("/tutorials/:id", async (req, res) => {
  const id = req.params.id
  try {
    console.log("Trying to delete tutorial:", id)
    const result = await Tutorial.destroy({where: {id: id}});
    if (result === 0) {
      return res.status(404).json({message: "Item not found"});
    }
    res.status(200).json({message: "Delete successful"});
  } catch (error) {
    res.status(500).json({message: "Delete failed", error: error.message});
  }
});


module.exports = router;
