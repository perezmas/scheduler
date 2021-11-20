import React, { FC } from "react";
import { RouteComponentProps } from "react-router-dom";
import PlanProps from "../interfaces/Plan";
import PlanPage from "./PlanPage";

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

export default IndexPage;
