import React from "react";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Plan from "./Plan";

// Master Plan View
export default function IndexPage(): JSX.Element {
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
}