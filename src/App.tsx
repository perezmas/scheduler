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
import IndexPage from "./components/IndexPage";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import usePlans, { Plans } from "./hooks/usePlans";

// Master Plan View

type PlansPageProps = RouteComponentProps<MatchParams> & {
    requirements: string[];
    plans: Plans; 
};

interface MatchParams {
    uuid: string;
}



const Plan: FC<PlansPageProps> = (props) => {
    const uuid = props.match.params.uuid;
    return (
        <>
            <SchedulerWalkthrough />
            <p></p>
            <DndProvider backend={HTML5Backend}>
                <Scheduler requirements={props.requirements} plans={props.plans} scheduleId={uuid} />
            </DndProvider>
            
        </>
    );
};

function App(): JSX.Element {
    const plans = usePlans();
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
                            <Plan {...props} requirements={requirements} plans={plans} />
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
                            />
                        }
                    ></Route>
                </Router>
            </Switch>
        </HashRouter>
    );
}

export default App;
