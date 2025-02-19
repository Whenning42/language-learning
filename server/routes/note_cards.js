const express = require("express");
const router = express.Router();
const NoteCard = require("../app/models/note_card");

router.post("/note-cards", async (req, res) => {
  try {
    const note_card = await NoteCard.create(req.body);
    res.status(201).json(tutorial);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});


router.get("/note-cards", async (req, res) => {
  try {
    const note_cards = await NoteCard.findAll();
    res.json(note_cards);
  } catch (error) {
    console.log("Failed to fetch notecards:", error.message);
    res.status(500).json({error: error.message});
  }
});

// router.delete("/tutorials/:id", async (req, res) => {
//   const id = req.params.id
//   try {
//     console.log("Trying to delete tutorial:", id)
//     const result = await Tutorial.destroy({where: {id: id}});
//     if (result === 0) {
//       return res.status(404).json({message: "Item not found"});
//     }
//     res.status(200).json({message: "Delete successful"});
//   } catch (error) {
//     res.status(500).json({message: "Delete failed", error: error.message});
//   }
// });

module.exports = router;
