import React, {useState, useEffect} from "react";
import "./study-timer.css"

function StudyTimer() {
    // TODO: Make time tick down.
    const [timeLeft, setTimeLeft] = useState(0);

    const renderTime = (seconds) => {
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        var ms = String(minutes).padStart(2, "0");
        var ss = String(seconds).padStart(2, "0");
        return ms + ":" + ss;
    }

    useEffect(() => {
        if (timeLeft <= 0) return; // Stop when countdown reaches zero

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, [timeLeft]);

    const changeTimeDelta = 600;
    const onAddTime = () => {
        setTimeLeft(timeLeft + changeTimeDelta);
    }

    const onRemoveTime = () => {
        setTimeLeft(Math.max(timeLeft - changeTimeDelta, 0));
    }

    var timeStr = renderTime(timeLeft);
    return (
        <div className="timer-div">
            Study Timer
            <div className="clock">{timeStr}</div>
            <button className="timer-button" onClick={onAddTime}>+10 min</button>
            <button className="timer-button" onClick={onRemoveTime}>-10 min</button>
        </div>
    );
}

export default StudyTimer;
