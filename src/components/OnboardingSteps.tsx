import React, { useState } from "react";
import ReactJoyride from "react-joyride";

const OnboardingSteps: React.FunctionComponent = () => {
    const [joyride, setJoyride] = useState({
        run: false,
        steps: [
            {
                title: "Welcome to the UD CIS Scheduler!",
                disableBeacon: true,
                target: "body",
                content: <div><h4>This is the main page where you can create, edit, duplicate, and delete individual degree plans.</h4></div>,
            },
            {
                title: "Add Degree Plans here!",
                target: ".grid",
                content: "This is where you can add a plan to start designing your own schedule.",
            },
            {
                title: "Keep degree requirements up-to-date here!",
                target: ".my-2.btn.btn-primary",
                content: "Here, you can modify the requirements needed to complete your custom degree plan. Add a plan to get started!",
            },
        ]
    });

    return (
        <>
            <div style={{ marginLeft: "2%", marginRight: "auto" }}>
                <button className="btn btn-primary" onClick={() => {
                    setJoyride({ ...joyride, run: !joyride.run }); 
                }}
                style={{ backgroundColor: "#ff0044", color: "white", border: "none", fontSize: "20px", padding: "15px 32px", cursor: "pointer", borderRadius: "50px" }}>Take the tour</button>
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

export default OnboardingSteps;