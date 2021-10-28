import React from "react";
import "./Year.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Scheduler } from "./components/Scheduler";
import Plans from "./components/Plans";
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
    return <Plans/>;
    
};

const Plan = () => {
    return <Scheduler/>;
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
                <Link to ="/">Home Page</Link>
                <Route exact path="/" component={IndexPage}/>
                <Link to = "/plan">Plan</Link>
                <Route exact path="/plan" component={Scheduler}/>
                <Link to = "/users">Users</Link>
                <Route exact path="/users" component={UsersPage}/>
                <Route exact path="/users/:userId" component={UserPage}/>
            </Router>
            <a href="/about">about with browser reload</a>
        </div>
    );
}

export default App;
