import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App(): JSX.Element {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                UD CIS Scheduler
                <p>
                    Lucas D
                    <br />
                    Max P-M

                </p>
                <p>Amani Kiruga</p>
            </header>
        </div>
    );
}

export default App;
