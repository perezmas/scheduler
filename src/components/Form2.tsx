import React from "react";
//import ReactDOM from "react-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function Form2(): JSX.Element {

    //initial value of state variables
    const [name, setName] = useLocalStorage("name2", "");

    return (
        <form>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" aria-label="fullname"></input>
        </form>
    );
}

export default Form2;