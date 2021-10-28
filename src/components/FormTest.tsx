//import React, {useState, useEffect} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function FormTest(): JSX.Element {

    //initial value of name state variable
    const [name, setname] = useLocalStorage("name", "");
    return (
        <form>
            <input type="text" value={name} onChange={(e) => setname(e.target.value)} placeholder="Full name" aria-label="fullname"
            ></input>
            <input type="submit" value="Submit"></input>
        </form>
    );
}

export default FormTest;