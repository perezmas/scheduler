import React from "react";
import "./Year.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
/* import { Scheduler } from "./components/Scheduler"; */
import FormTest from "./components/FormTest";

function App(): JSX.Element {
    return (
        <div className="container">
            <h1>localStorage test w React hooks</h1>
            <FormTest />
        </div>
    );
}

export default App;
