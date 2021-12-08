import React, { FC } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Plans } from "../hooks/usePlans";
import PlanProps from "../interfaces/Plan";
import PlanPage from "./PlanPage";

type IndexPageProps = RouteComponentProps & {
    plans: Plans;
};
const IndexPage: FC<IndexPageProps> = (props) => {
    const { plans } = props;
    return (
        <div className="home">
            <div className="home-content">
                <h1 className="center mb-5">UD CIS Scheduler</h1>
                <PlanPage plans={plans} />
            </div>
        </div>
    );
};

export default IndexPage;
