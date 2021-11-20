import React from "react";
import { screen, render } from "@testing-library/react";
import SchedulerWalkthrough from "../components/SchedulerWalkthrough";

describe(SchedulerWalkthrough, () => {
    it("renders without issue", () => {
        render(<SchedulerWalkthrough />);
    });
    it("Starts tour when you click the text", async () => {
        render(<SchedulerWalkthrough />);

        expect(
            screen.getByTestId("scheduler-walkthrough-button")
        ).toBeInTheDocument();

        expect(screen.getByText("Need Help?")).toBeInTheDocument();
    });
});
