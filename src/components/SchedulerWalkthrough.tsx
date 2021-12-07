import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ReactJoyride from "react-joyride";

const SchedulerWalkthrough: React.FunctionComponent = () => {
    const [joyride, setJoyride] = useState({
        run: false,
        steps: [
            {
                title: "Welcome to the Scheduler Page!",
                disableBeacon: true,
                target: ".degree-requirements-wrapper",
                content:
                    "This is the page where you can edit the details of your degree plan.",
            },
            {
                title: "Start here with your first year.",
                disableBeacon: true,
                target: ".container-fluid",
                content:
                    "This is where you can begin to add the courses for your degree plan. Enter course name, course ID, description, whether it is a pre/corequisite and a number of credits. Or hit the dropdown to reset/remove the current semester.",
            },
            {
                title: "Check which degree requirements are unmet here!",
                disableBeacon: true,
                target: ".table",
                content:
                    "Here, you can find the requirements that you listed on the Modify Requirements page in order to complete your custom degree plan.",
            },
            {
                title: "Click on 'Year 1' to get started!",
                disableBeacon: true,
                target: ".container-fluid",
                content:
                    "Click the button by each semester to add courses to it. Good luck!",
            },
        ],
    });
    useEffect(() => {
        setJoyride({ ...joyride, run: !joyride.run });
    }, []);
    
    return (
        <>
            <div style={{ marginRight: "2%", textAlign: "right" }}>
                <Button
                    variant="danger"
                    data-testid="scheduler-walkthrough-button"
                    onClick={() => {
                        setJoyride({ ...joyride, run: !joyride.run });
                    }}
                >
                    Need Help?
                </Button>
            </div>
            <ReactJoyride
                steps={joyride.steps}
                run={joyride.run}
                continuous
                showProgress
                showSkipButton
                styles={{
                    tooltipContainer: {
                        textAlign: "left",
                    },
                    buttonNext: {
                        backgroundColor: "#ff0044",
                    },
                    buttonBack: {
                        marginRight: 10,
                    },
                }}
                locale={{
                    last: "End Tour",
                    skip: "Close Tour",
                }}
            />
        </>
    );
};

export default SchedulerWalkthrough;
