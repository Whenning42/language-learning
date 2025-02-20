import React, {useState} from 'react';

import NoteCardEditor from "./note-card-editor";
import NoteCardsViewer from "./note-cards-viewer";

// Contains the notecard editor and viewer
// On editor save or cancel, go back to the viewer.
// On viewer edit or new, go to the editor with the corresponding text set.

function NoteCardsPane() {
    const [isInEditor, setIsInEditor] = useState(false);
    const [editorNoteCard, setEditorNoteCard] = useState({});

    const editCard = (noteCard) => {
        setEditorNoteCard(noteCard);
        setIsInEditor(true);
    }

    const newCard = () => {
        setEditorNoteCard({});
        setIsInEditor(true);
    }

    const exitEditor = () => {
        setIsInEditor(false);
    }

    return isInEditor ?
        (<NoteCardEditor onExit={exitEditor} editNoteCard={editorNoteCard}/>)
      : (<NoteCardsViewer openInEditor={editCard} newInEditor={newCard}/>);
}

export default NoteCardsPane;
