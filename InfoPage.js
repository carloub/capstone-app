import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

const InfoPage = () => {
    return (
        <div>
            <h2>Info</h2>
            <p>This project estimates your lifespan based off of your responses to the form.</p>
            <p>You can watch your time tick away!</p>
            <p>Remember to seize the day! You only live once!</p>

            <nav>
                <Link to="/">Close</Link>
            </nav>
        </div>
    );
};

export default InfoPage;