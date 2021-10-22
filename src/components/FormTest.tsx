import React, {useState} from "react";

export function FormTest(): JSX.Element {
    const [name, setname] = useState("");

    return (
        <form>
            <input type="text" value={name} onChange={(e) => setname(e.target.value)} placeholder="Full name" aria-label="fullname"
            ></input>
            <input type="submit" value="Submit"></input>
        </form>
    );
}

export default FormTest;