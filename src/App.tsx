import React, { FC, useState } from "react";
import "./Year.css";
import "./App.css";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    HashRouter as Router,
    Route,
    HashRouter,
    RouteComponentProps,
} from "react-router-dom";
import { Switch } from "react-router-dom";

import { Scheduler } from "./components/Scheduler";
import Requirements from "./components/Requirements";
import SchedulerWalkthrough from "./components/SchedulerWalkthrough";
import NavigationBar from "./components/NavigationBar";
import PlanProps from "./interfaces/Plan";
import IndexPage from "./components/IndexPage";

// Master Plan View

type PlansPageProps = RouteComponentProps & {
    requirements: string[];
};

const Plan: FC<PlansPageProps> = (props) => {
    return (
        <>
            <SchedulerWalkthrough />
            <p></p>
            <Scheduler requirements={props.requirements} />
        </>
    );
};

function App(): JSX.Element {
    const [plans, setPlans] = useState<Array<PlanProps>>([]);
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
        <HashRouter>
            <div>
                <NavigationBar />
            </div>
            <Switch>
                <Router>
                    <Route
                        path="/Plans/:uuid"
                        render={(props) => 
                            <Plan {...props} requirements={requirements} />
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
                    <Route
                        path="/"
                        exact
                        render={(props) => 
                            <IndexPage
                                {...props}
                                plans={plans}
                                setPlans={setPlans}
                            />
                        }
                    ></Route>
                </Router>
            </Switch>
        </HashRouter>
    );
}

export default App;
