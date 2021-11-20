import React from "react";
import { screen, render } from "@testing-library/react";
import MainPageWalkthrough from "../components/MainPageWalkthrough";

describe(MainPageWalkthrough, () => {
    it("renders without issue", () => {
        render(<MainPageWalkthrough />);
    });
    it("Starts tour when you click the text", async () => {
        render(<MainPageWalkthrough />);

        expect(
            screen.getByTestId("main-page-walkthrough-modal")
        ).toBeInTheDocument();

        expect(screen.getByText("Tutorial")).toBeInTheDocument();
    });
});
