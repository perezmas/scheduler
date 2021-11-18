import React, { FC, useState } from "react";
import "./Year.css";
import "./App.css";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Link,
    HashRouter as Router,
    Route,
    HashRouter,
    RouteComponentProps,
} from "react-router-dom";
import { Switch } from "react-router-dom";
import Plan from "./components/Plan";
import { Button } from "react-bootstrap";
import { Scheduler } from "./components/Scheduler";
import Requirements from "./components/Requirements";
//import ReactDOM from "react-dom";

// Master Plan View
const IndexPage = () => {
    return (
        <>
            <div>
                <h1 className="center">UD CIS Scheduler</h1>
                <h3 className="center">Designed By: Lucas, Max, and Amani</h3>
                <div role="alert" className="welcome">
                    <p>Welcome to the UD Degree Planner!</p>
                    <b>Click Add/Edit Plan below to Get Started</b>
                </div>
                <Plan/>
            </div>
            <Link to="/Requirements">
                <Button className="my-2">Modify Requirements</Button>
            </Link>
        </>
    );
};

type PlansPageProps = RouteComponentProps & {
    requirements: string[];
};

const PlansPage: FC<PlansPageProps> = (props) => {
    return (
        <>
            <Scheduler requirements={props.requirements} />
            <Link to="/">
                <Button>Back</Button>
            </Link>
        </>
    );
};

function App(): JSX.Element {
    const [requirements, setRequirements] = useState<string[]>(
        Array<string>("CISC220", "CISC275", "MATH243")
    );
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
                        <Route
                            path="/Plans/:uuid"
                            render={(props) => 
                                <PlansPage
                                    {...props}
                                    requirements={requirements}
                                />
                            }
                        ></Route>
                        <Route
                            path="/Requirements"
                            render={(props) => 
                                <Requirements
                                    {...props}
                                    requirements={requirements}
                                    onAddRequirement={addRequirement}
                                    onRemoveRequirement={removeRequirement}
                                />
                            }
                        ></Route>
                        <Route exact path="/" component={IndexPage}></Route>
                    </Router>
                </Switch>
            </HashRouter>
        </div>
    );
}

export default App;
