import React from "react";
import {screen, render, waitFor} from "@testing-library/react";
import MainPageWalkthrough from "../components/MainPageWalkthrough";

describe(MainPageWalkthrough, ()=> {
    it("Starts tour when you click the button", async() => {
        render(<MainPageWalkthrough
            
        />);
        (await screen.findByTestId("take-tour-button")).click();

        screen.getByText("Close Tour").click();

        await waitFor( ()=> {
            screen.queryByTestId("main-page-walkthrough-modal".not.toBeInTheDocument());
        })
    })
})