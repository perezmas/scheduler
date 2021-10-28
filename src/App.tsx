import React from "react";
import "./Year.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Scheduler } from "./components/Scheduler";
import Plans from "./components/Plans";
import { Button } from "react-bootstrap";
//import ReactDOM from "react-dom";

const users = [
    {
        name: "Max"
    },
    {
        name:  "Emily"
    },
    {
        name: "Egg boy"
    }
];

const IndexPage = () => {
    return (
        <div>
            <h1 className="center">Master Plan View</h1>
            <Plans />
        </div>
    );
    
};

const Plan = () => {
    return (
        <>
            <Link to="/">
                <Button variant="secondary" >
                    Home</Button></Link>
            <Scheduler />
        </>
    );
};

const UsersPage = () => {
    return (
        <>{users.map((user,index) => (
            <h5 key={index}>
                <Link to={"/user/${index+1}"}>{user.name}s Page</Link>
            </h5>
        ))}
        </>
    );
};

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
};

function App(): JSX.Element {

    return (
        <div className="container">
            
            <Router>

                <Switch>
                    <Route exact path="/" component={IndexPage}></Route>
                    <Route exact path="/plan" component={Plan}></Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
