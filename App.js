import { BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import FormPage from "./FormPage";
import InfoPage from "./InfoPage";


function App() {

    // Notes
    //currentTime: seconds since January 1, 1970
    //used time = currentTime - birth date (seconds since January 1, 1970) *can be negative*
    //total time to live is received from model
    //time left = total time - used time

    /////////////////////////////////////////////////////////////////////////////////
    //My Timer
    const Timer = ({ initialTime }) => {
        const [timeLeft, setTimeLeft] = useState(initialTime);

        useEffect(() => {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    prevTime = prevTime -1;
                    return prevTime;
                });

            }, 1000);

            return () => clearInterval(timer);
        }, []);

        const isNegative = timeLeft <= 0; // Check if timeLeft is less than or equal to 0

        const formatTime = time => {
            const absTime = Math.abs(time);
            const years = Math.floor(absTime / (365 * 24 * 3600));
            const months = Math.floor((absTime % (365 * 24 * 3600)) / (30 * 24 * 3600))
            const days = Math.floor((absTime % (30 * 24 * 3600)) / (24 * 3600));
            const hours = Math.floor((absTime % 86400) / (60*60));
            const minutes = Math.floor((absTime % 3600) / 60);
            const seconds = Math.floor(absTime % 60);

            const pad = num => (num < 10 ? '0' + num : num);

            return `${years} years ${pad(months)} months ${pad(days)} days ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        };

        return (
            <div className={isNegative ? "Timer-neg" : "Timer-pos"} >
                <h1>Your Lifespan:</h1>
                <h2>{isNegative ? "-" : ""}{formatTime(timeLeft)}</h2>
                <h3>{isNegative ? "You're living on borrowed time..." : ""}</h3>
            </div>
        );
    };

    ////////////////////////////////////////////////////////////////////////////////////
    // Talk to the back-end for current-time
    const [currentTime, setCurrentTime] = useState(0);
    useEffect(() => {
        fetch('/time').then(res => res.json()).then(data => {
            setCurrentTime(data.time);
        });
        }, []);

    //Determine if the form is submitted
    const[isFormSubmitted, setIsFormSubmitted] = useState(false);
    const[remainingSeconds, setRemainingSeconds] = useState(null);

    const handleFormSubmit = (remainingSeconds) => {
        console.log("value changed");
        setIsFormSubmitted(true);
        setRemainingSeconds(remainingSeconds);
        console.log("Remaining Seconds: ", remainingSeconds);
    };

    ///////////////////////////////////////////////////////////////////////////////////////
    // Make the front end page
    return (
        <div className="App">

            <Router>
                <nav className='App-nav'>
                    <ul>
                        <li>
                            <Link to={"./form"}>Form</Link>
                        </li>
                        <li>
                            <Link to={"./info"}>Info</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/form" element={<FormPage onFormSubmit={handleFormSubmit}/>}/>
                    <Route path="/info" element={<InfoPage/>}/>
                </Routes>
            </Router>

            <header className="App-header">

                <h1 className='fancy-header'>For Whom The Bell Tolls</h1>
                <h2 className='fancy-header-small'>a project by Brandon Carlough</h2>
                
                {isFormSubmitted ? 
                    (currentTime !== 0 ? <Timer initialTime={remainingSeconds}/> : <p>Loading...</p>)
                    : <h2>Please fill out the form first</h2>}
            </header>
        </div>
    );
}

export default App;
