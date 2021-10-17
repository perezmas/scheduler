import React, { useState } from "react";
import "./App.css";
import {v4 as uuid} from "uuid";
import Year from "./components/Year";

function App(): JSX.Element {
    const yruuid = useState(uuid);
    return (
        <div className="App">
            <Year uuid={yruuid[0]} level="FRESHMAN" num={1}/>
        </div>
    );
}

export default App;
