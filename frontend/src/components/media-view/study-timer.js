import React, {useState, useEffect} from "react";
import "./study-timer.css"

function StudyTimer() {
    // TODO: Make time tick down.
    const [clock, setClock] = useState({
        timeLeft: 0,
        isPaused: false
    });

    const renderTime = (seconds) => {
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        var ms = String(minutes).padStart(2, "0");
        var ss = String(seconds).padStart(2, "0");
        return ms + ":" + ss;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setClock((clk) => {
                if (clk.isPaused) {
                    return clk;
                }

                const newTime = Math.max(clk.timeLeft - 1, 0);
                return {...clk, timeLeft: newTime};
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, []);

    const changeTimeDelta = 600;
    const onAddTime = () => {
        setClock({...clock, timeLeft: clock.timeLeft + changeTimeDelta});
    }

    const onRemoveTime = () => {
        setClock({...clock, timeLeft: Math.max(clock.timeLeft - changeTimeDelta, 0)});
    }

    const onToggle = () => {
        setClock({...clock, isPaused: !clock.isPaused});
    }

    const clock_class = "clock " + (clock.isPaused ? "paused-clock" : "");
    return (
        <div className="timer-div">
            Study Timer
            <div className={clock_class}>{renderTime(clock.timeLeft)}</div>
            <button className="timer-button" onClick={onAddTime}>+10 min</button>
            <button className="timer-button" onClick={onRemoveTime}>-10 min</button>
            <button className="timer-button" onClick={onToggle}>Start/Stop</button>
        </div>
    );
}

export default StudyTimer;
