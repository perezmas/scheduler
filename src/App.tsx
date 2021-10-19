import React from "react";
import "./Year.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Scheduler } from "./components/Scheduler";

function App(): JSX.Element {
    return (
        <div className="App">
            <Scheduler/>
        </div>
    );
}

export default App;
