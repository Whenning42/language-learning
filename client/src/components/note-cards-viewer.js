import React, {useState, useEffect} from 'react';

import "./note-cards.css"
import http from "../http-common";

function NoteCardsViewer({openInEditor, newInEditor}) {
    const [curNoteCard, setCurNoteCard] = useState(0);
    const [noteCards, setNoteCards] = useState([]);

    useEffect(() => {
        retrieveNoteCards();
        setCurNoteCard(0);
    }, []);

    const retrieveNoteCards = async () => {
        const res = await http.get("/note-cards");
        const note_cards = res.data;
        const new_note_card_index = mod(curNoteCard, note_cards.length);

        setNoteCards(note_cards);
        setCurNoteCard(new_note_card_index);
    };

    const mod = (n, m) => {
        if (m == 0) {
            return 0;
        }
        return ((n % m) + m) % m;
    }

    const onPrev = () => {
        setCurNoteCard(mod(curNoteCard - 1, noteCards.length));
    }

    const onNext = () => {
        setCurNoteCard(mod(curNoteCard + 1, noteCards.length));
    }

    const onDelete = () => {
        // TODO: Confirm delete?
        if (noteCards.length < 1) {
            return;
        }
        const id = noteCards[curNoteCard].id;
        http.delete(`/note-cards/${id}`)
            .then(response => {
                retrieveNoteCards();
            }).catch(error => {
                console.error(error);
            });
    }

    const onEdit = () => {
        openInEditor(noteCards[curNoteCard]);
    }

    const onNew = () => {
        newInEditor();
    }

    const noteCard = noteCards[curNoteCard] || {enText: "", deText: ""};
    return (
        <div style={{border: '1px solid black', flex: 1, display: "flex", flexDirection: "column", padding: ".5rem"}}>
            <h5>English</h5>
            <textarea value={noteCard.enText} style={{flex: 1}} readOnly={true}></textarea><br/>
            <h5>German</h5>
            <textarea value={noteCard.deText} style={{flex: 1}} readOnly={true}></textarea><br/>
            <div style={{display: "flex", alignItems: "center"}}>
                <button className="notecard-editor-button" onClick={onPrev}>Prev</button>
                <button className="notecard-editor-button" onClick={onNext}>Next</button>
                Card: {curNoteCard + 1}/{noteCards.length}
                <div style={{marginLeft: "auto"}}>
                    <button className="notecard-editor-button" onClick={onDelete}>Delete</button>
                    <button className="notecard-editor-button" onClick={onEdit}>Edit</button>
                    <button className="notecard-editor-button" onClick={onNew}>New</button>
                </div>
            </div>
        </div>
    )
}

export default NoteCardsViewer;
