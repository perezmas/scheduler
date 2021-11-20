import React from "react";
import App from "../App";
import { screen, render, waitFor } from "@testing-library/react";

describe("Plan", () => {
    beforeEach(async () => {
        render(<App />);
    });

    it("Should add plans when the add plan button is clicked", async () => {
        expect(screen.queryByTestId("edit-plan")).not.toBeInTheDocument();
        screen.getByTestId("add-plan").click();
        expect(screen.getByTestId("edit-plan")).toBeInTheDocument();
        screen.getByTestId("add-plan").click();
        expect(screen.getAllByTestId("edit-plan")).toHaveLength(2);
    });
    it("Should ask for a confirmation if the user tries to remove a plan, and delete the plan iff they click ok", async () => {
        const confirmSpy = jest.spyOn(window, "confirm");
        confirmSpy.mockReturnValue(false);
        screen.getByTestId("add-plan").click();
        expect(confirmSpy).not.toHaveBeenCalled();
        screen.getByTestId("plan-toggle").click();
        await screen.findByTestId("delete-plan");
        screen.getByTestId("delete-plan").click();
        expect(confirmSpy).toHaveBeenCalled();
        expect(screen.getByTestId("edit-plan")).toBeInTheDocument();
        confirmSpy.mockReturnValue(true);
        screen.getByTestId("delete-plan").click();
        expect(screen.queryByTestId("edit-plan")).not.toBeInTheDocument();
    });
    it("Allows you to duplicate a plan", async () => {
        screen.getByTestId("add-plan").click();
        screen.getByTestId("plan-toggle").click();
        await screen.findByTestId("copy-plan");
        screen.getByTestId("copy-plan").click();
        expect(screen.getAllByText("Plan #0")).toHaveLength(2);
    });
    it("Should reroute the user when they click the button to edit a plan", async () => {
        screen.getByTestId("add-plan").click();
        screen.getByTestId("edit-plan").click();
        await screen.findByTestId("Year 1");
        screen.getByText("Home").click();
        await waitFor(() => {
            expect(screen.queryByTestId("Year 1")).not.toBeInTheDocument();
        });
    });
});
