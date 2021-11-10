import React, { useState } from "react";
import "./Year.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Link,
    HashRouter as Router,
    Route,
    HashRouter,
} from "react-router-dom";
import { Switch } from "react-router-dom";
//import { Scheduler } from "./components/Scheduler";
import Plan from "./components/Plan";
import { Button } from "react-bootstrap";
import { Scheduler } from "./components/Scheduler";
import Requirements from "./components/Requirements";
//import ReactDOM from "react-dom";

/*
const users = [
    {
        name: "Max"
    },
    {
        name:  "Lucas"
    },
    {
        name: "Amani"
    }
];*/

// Master Plan View
const IndexPage = () => {
    return (
        <div>
            <h1 className="center">Master Plan View</h1>
            <Plan uuid="" id={0} />
            {console.log("the plan is : ", JSON.stringify(Plan))}
            {localStorage.getItem(JSON.stringify(Plan))}
        </div>
    );
};

// Specific Plan Page
/*
const Plans = () => {
    return (
        <>
            <Link to="/">
                <Button variant="secondary" >
                    Home</Button></Link>
            <Scheduler />
        </>
    );
};*/

const PlansPage = () => {
    return (
        <>
            {/*
            {users.map((user, index) => (
                <h5 key={index}>
                    <Link to={`/user/${index + 1}`}>{user.name}s Page</Link>
                </h5>

            ))}
            */}
            <Scheduler />
            <Link to="/">
                <Button>Back</Button>
            </Link>
        </>
    );
};
/*
const UserPage = () => {
 
    return (
        <><p>
            <strong>User ID: </strong>
            {}
        </p>
        <p>
            <strong>User Name: </strong>
            {users}
        </p>
        </>
    );
};*/

function App(): JSX.Element {
    const [requirements, setRequirements] = useState<string[]>(Array<string>());
    const addRequirement = (requirement: string) => {
        setRequirements([...requirements, requirement]);
    };
    const removeRequirement = (requirement: string) => {
        setRequirements(requirements.filter((r) => r !== requirement));
    };
    return (
        <div className="container">
            <HashRouter>
                <Switch>
                    <Router>
                        <Route exact path="/" component={IndexPage}></Route>
                        <Route
                            path="/Plans/:uuid"
                            component={PlansPage}
                        ></Route>
                        <Route
                            path="/Requirements"
                            render={(props) => (
                                <Requirements
                                    {...props}
                                    requirements={requirements}
                                    onAddRequirement={addRequirement}
                                    onRemoveRequirement={removeRequirement}
                                />
                            )}
                        ></Route>
                    </Router>
                </Switch>
            </HashRouter>
        </div>
    );
}

export default App;
