import React, {useState} from 'react';

import "./note-cards.css"
import http from "../../lib/http-common";

function NoteCardEditor({onExit, editNoteCard, cardNum, totalCards}) {
    const [enText, setEnText] = useState(editNoteCard.enText || '');
    const [deText, setDeText] = useState(editNoteCard.deText || '');

    const onChangeEnText = (e) => {
        setEnText(e.target.value);
    }

    const onChangeDeText = (e) => {
        setDeText(e.target.value);
    }

    const onCancel = () => {
        onExit();
    }

    const onSave = async () => {
        const note_card = {
            enText: enText,
            deText: deText
        };
        if (editNoteCard.id) {
            const id = editNoteCard.id;
            const response = await http.put(`/note-cards/${id}`, note_card)
        } else {
            const response = await http.post("/note-cards", note_card);
        }
        onExit();
    }

    return (
        <div style={{border: '1px solid black', flex: 1, display: "flex", flexDirection: "column", padding: ".5rem"}}>
            <h4>Notecard Editor</h4>
            <h5>English</h5>
            <textarea value={enText} style={{flex: 1}} onChange={onChangeEnText}></textarea><br/>
            <h5>German</h5>
            <textarea value={deText} style={{flex: 1}} onChange={onChangeDeText}></textarea><br/>
            <div style={{display: "flex", alignItems: "center"}}>
                Card {cardNum + 1}/{totalCards}
                <div style={{display: "flex", alignItems: "center", marginLeft: "auto"}}>
                    <button className="notecard-editor-button" onClick={onCancel}>Cancel</button>
                    <button className="notecard-editor-button" onClick={onSave}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default NoteCardEditor;
