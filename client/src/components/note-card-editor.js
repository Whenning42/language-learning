import React, {useState, useEffect} from 'react';

import "./note-card-editor.css"
import http from "../http-common";

function NoteCardEditor() {
    const [noteCards, setNoteCards] = useState([]);
    const [enText, setEnText] = useState('');
    const [deText, setDeText] = useState('');

    useEffect(() => {
        retrieveNotecards();
    }, []);

    const onChangeEnText = (e) => {
        setEnText(e.target.value);
    }

    const onChangeDeText = (e) => {
        setDeText(e.target.value);
    }

    // const onSwap = () => {
    //     var en_tmp = enText;
    //     var de_tmp = deText;
    //     setEnText(de_tmp);
    //     setDeText(en_tmp);
    // }

    const onPrev = () => {
        console.log("Prev");
    }

    const onNext = () => {
        console.log("Next");
    }

    const onDelete = () => {
        console.log("TODO: Implement delete!");
    }

    const onEdit = () => {
        console.log("TODO: Implement edit!");
    }

    const onNew = () => {
        console.log(`Submit en: ${enText}, de: ${deText}`);
    }

    const retrieveNotecards = () => {
        http.get("/note-cards")
            .then(response => {
                setNoteCards(response.data);
                console.log("Got notecards:", response.data);
            });
    };

    // TODO:
    // - Implement the notecard backend.
    //   - Get notecards
    //   - Create notecard
    //   - Update notecard
    //   - Delete notecard

    return (
        <div style={{border: '1px solid black', flex: 1, display: "flex", flexDirection: "column", padding: ".5rem"}}>
            <h5>English</h5>
            <textarea value={enText} style={{flex: 1}} onChange={onChangeEnText}></textarea><br/>
            <h5>German</h5>
            <textarea value={deText} style={{flex: 1}} onChange={onChangeDeText}></textarea><br/>
            <div style={{display: "flex", alignItems: "center"}}>
                <button className="notecard-editor-button" onClick={onPrev}>Prev</button>
                <button className="notecard-editor-button" onClick={onNext}>Next</button>
                Card: 0/0
                <div style={{marginLeft: "auto"}}>
                    <button className="notecard-editor-button" onClick={onDelete}>Delete</button>
                    <button className="notecard-editor-button" onClick={onEdit}>Edit</button>
                    <button className="notecard-editor-button" onClick={onNew}>New</button>
                </div>
            </div>
        </div>
    )
}

export default NoteCardEditor;
