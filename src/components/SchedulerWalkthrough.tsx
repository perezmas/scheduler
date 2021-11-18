import React, { useState } from "react";
import ReactJoyride from "react-joyride";

const SchedulerWalkthrough: React.FunctionComponent = () => {
    const [joyride, setJoyride] = useState({
        run: false,
        steps: [
            {
                title: "Welcome to the Scheduler Page!",
                disableBeacon: true,
                target: "body",
                content: <div><h4>This is the page where you can edit the details of your degree plan.</h4></div>,
            },
            {
                title: "Start here with your first year.",
                target: ".container-fluid",
                content: "This is where you can begin to add the courses for your degree plan.",
            },
            {
                title: "Check which degree requirements are unmet here!",
                target: ".table",
                content: "Here, you can find the requirements that you listed on the Modify Requirements page in order to complete your custom degree plan.",
            },
            {
                title: "Click on the 'Year 1' arrow to get started.",
                target: ".container-fluid",
                content: "Click the plus button under each semester to add courses to it. Good luck!",
            },
        ]
    });

    return (
        <>
            <div style={{ marginLeft: "2%", marginRight: "auto" }}>
                <button className="btn btn-primary" onClick={() => {
                    setJoyride({ ...joyride, run: !joyride.run }); 
                }}
                style={{ backgroundColor: "#ff0044", color: "white", border: "none", fontSize: "20px", padding: "15px 32px", cursor: "pointer", borderRadius: "50px" }}>Click Here for Tutorial</button>
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
                    skip: "Close Tour"
                }} />
        </>
    );
};

export default SchedulerWalkthrough;