import React, {useState} from 'react';

import NoteCardEditor from "./note-card-editor";
import NoteCardsViewer from "./note-cards-viewer";

// Contains the notecard editor and viewer
// On editor save or cancel, go back to the viewer.
// On viewer edit or new, go to the editor with the corresponding text set.

function NoteCardsPane() {
    // TODO: Make "new card" in editor set viewer card to the added card.
    const [isInEditor, setIsInEditor] = useState(false);
    const [editorNoteCard, setEditorNoteCard] = useState({});
    const [editorCardIndex, setEditorCardIndex] = useState(0);
    const [editorNumCards, setEditorNumCards] = useState(0);

    const editCard = (noteCard, cardI, cardN) => {
        setEditorNoteCard(noteCard);
        setIsInEditor(true);
        setEditorCardIndex(cardI);
        setEditorNumCards(cardN);
    }

    const newCard = (cardI, cardN) => {
        setEditorNoteCard({});
        setIsInEditor(true);
        setEditorCardIndex(cardI);
        setEditorNumCards(cardN);
    }

    const exitEditor = () => {
        setIsInEditor(false);
    }

    return isInEditor ?
        (<NoteCardEditor onExit={exitEditor} editNoteCard={editorNoteCard} cardNum={editorCardIndex} totalCards={editorNumCards}/>)
      : (<NoteCardsViewer openInEditor={editCard} newInEditor={newCard}/>);
}

export default NoteCardsPane;
