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
import PlanPage from "./components/PlanPage";

import { Scheduler } from "./components/Scheduler";
import Requirements from "./components/Requirements";
import SchedulerWalkthrough from "./components/SchedulerWalkthrough";
import NavigationBar from "./components/NavigationBar";
import PlanProps from "./interfaces/Plan";
//import ReactDOM from "react-dom";

// Master Plan View
type IndexPageProps = RouteComponentProps & {
    plans: PlanProps[];
    setPlans: (plans: PlanProps[]) => void;
};
const IndexPage: FC<IndexPageProps> = (props) => {
    const { plans, setPlans } = props;
    return (
        <div className="home">
            <div className="home-content">
                <h1 className="center mb-5">UD CIS Scheduler</h1>
                <PlanPage plans={plans} setPlans={setPlans} />
            </div>
        </div>
    );
};

type PlansPageProps = RouteComponentProps & {
    requirements: string[];
};

const Plan: FC<PlansPageProps> = (props) => {
    return (
        <>
            {/*
            {users.map((user, index) => (
                <h5 key={index}>
                    <Link to={`/user/${index + 1}`}>{user.name}s Page</Link>
                </h5>

            ))}
            */}
            <SchedulerWalkthrough />
            <p></p>
            <Scheduler requirements={props.requirements} />

            {console.log("the uuid is : ", localStorage.getItem("plan: 0"))}
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
        <>
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
        </>
    );
}

export default App;
