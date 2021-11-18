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
import { Button } from "react-bootstrap";
import { Scheduler } from "./components/Scheduler";
import Requirements from "./components/Requirements";
import IndexPage from "./components/IndexPage";

type PlansPageProps = RouteComponentProps & {
    requirements: string[];
};

export const PlansPage: FC<PlansPageProps> = (props) => {
    return (
        <>
            <Scheduler requirements={props.requirements} />
            <Link to="/">
                <Button data-testid="back-button">Back</Button>
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
