import React, { useState } from "react";
import ReactJoyride from "react-joyride";

const MainPageWalkthrough: React.FunctionComponent = () => {
    const [joyride, setJoyride] = useState({
        run: false,
        steps: [
            {
                title: "Welcome to the UD CIS Scheduler!",
                disableBeacon: true,
                target: ".g-4",
                content: "This is the main page where you can create, edit, duplicate, and delete individual degree plans.",
            },
            {
                title: "Add Degree Plans here!",
                target: ".add-plan-card",
                content: "This is where you can add a plan to start designing your own CIS degree plan.",
            },
            {
                title: "Keep degree requirements up-to-date here!",
                target: ".home-page-reqs",
                content: "Here, you can modify the requirements needed to complete your custom degree plan.",
            },
            {
                title: "More resources available as well!",
                target: ".home-page-resources",
                content: "Helpful links where you can find the CIS Course Catalog, your UDSIS, and the CISC Department Page.",
            },
            {
                title: "Good Luck!",
                target: ".home-page-reqs",
                content: "Add a plan to get started.",
            },
        ]
    });

    return (
        <>
            <div
                id="text"
                data-testid={"main-page-walkthrough-modal"} 
                style={{ marginLeft: "2%", marginRight: "auto", padding: "0.5rem", color: "black", opacity: 0.55, cursor: "pointer"}} 
                onClick={() => setJoyride({ ...joyride, run: !joyride.run })}><a>Tutorial</a>
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

export default MainPageWalkthrough;