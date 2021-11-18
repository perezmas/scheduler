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
import NavigationBar from "./components/NavigationBar";
//import ReactDOM from "react-dom";

// Master Plan View
const IndexPage = () => {
    return (
        <div className="home">
            <div>
                <NavigationBar />
            </div>
            <div className="home-content">
                <h1 className="center">UD CIS Scheduler</h1>
                <Plan uuid="" id={0} />
            </div>
        </div>
    );
};

type PlansPageProps = RouteComponentProps & {
    requirements: string[];
};

const PlansPage: FC<PlansPageProps> = (props) => {
    return (
        <>
            {/*
            {users.map((user, index) => (
                <h5 key={index}>
                    <Link to={`/user/${index + 1}`}>{user.name}s Page</Link>
                </h5>

            ))}
            */}
            <Scheduler requirements={props.requirements} />
            <Link to="/">
                <Button>Back</Button>
            </Link>
            {console.log("the uuid is : ", localStorage.getItem("plan: 0"))}
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
        <>
            <HashRouter>
                <Switch>
                    <Router>
                        <Route
                            path="/Plans/:uuid"
                            render={(props) => (
                                <PlansPage
                                    {...props}
                                    requirements={requirements}
                                />
                            )}
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
                        <Route exact path="/" component={IndexPage}></Route>
                    </Router>
                </Switch>
            </HashRouter>
        </>
    );
}

export default App;
