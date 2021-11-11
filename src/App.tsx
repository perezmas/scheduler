import React from "react";
import "./Year.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, HashRouter as Router, Route, HashRouter } from "react-router-dom";
import { Switch } from "react-router-dom";
import Plan from "./components/Plan";
import { Button } from "react-bootstrap";
import { Scheduler } from "./components/Scheduler";


// Master Plan View
const IndexPage = () => {
    return (
        <div>
            <h1 className="center">UD CIS Scheduler</h1>
            <h3 className="center">Designed By: Lucas, Max, and Amani</h3>
            <div role="alert" className="welcome">
                <p>Welcome to the UD Degree Planner!</p>
                <b>Click Add/Edit Plan below to Get Started</b>
            </div>
            <Plan uuid="" id={0} />
        </div>
    );
    
};


const PlansPage = () => {
    return (
        <>
            <Scheduler/>
            <Link to ="/">
                <Button>Back
                </Button>
            </Link>
            {console.log("the uuid is : ", localStorage.getItem("plan: 0"))}
        </>
    );
};


function App(): JSX.Element {

    return (
        <div className="container">
            <HashRouter>
                <Switch>
                    <Router>
                        <Route exact path="/" component={IndexPage}></Route>
                        <Route path="/Plans/:uuid" component={PlansPage}></Route>
                    </Router>
                </Switch>
            </HashRouter>
        </div>
    );
}

export default App;
