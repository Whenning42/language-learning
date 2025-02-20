const express = require("express");
const router = express.Router();
const NoteCard = require("../app/models/note_card");

router.post("/note-cards", async (req, res) => {
  try {
    const note_card = await NoteCard.create(req.body);
    res.status(201).json(note_card);
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

router.put("/note-cards/:id", async (req, res) => {
  try {
    const id = req.params.id
    const {enText, deText} = req.body;
    const noteCard = await NoteCard.findByPk(id);
    noteCard.enText = enText || noteCard.enText;
    noteCard.deText = deText || noteCard.deText;
    await noteCard.save();
    res.status(200).json({message: "Updated note card"});
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Note card update failed"});
  }
});

router.delete("/note-cards/:id", async (req, res) => {
  const id = req.params.id
  try {
    const result = await NoteCard.destroy({where: {id: id}});
    if (result === 0) {
      return res.status(404).json({message: "Item not found"});
    }
    res.status(200).json({message: "Delete successful"});
  } catch (error) {
    res.status(500).json({message: "Delete failed", error: error.message});
  }
});

module.exports = router;
