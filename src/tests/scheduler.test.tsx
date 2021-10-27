import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { act } from "react-dom/test-utils";

async function addSemester(
    name: string,
    start: string,
    end: string
): Promise<void> {
    screen.getByTestId("trigger 1").click();
    const form = await screen.findByTestId("semester-form 1");

    expect(form).toBeInTheDocument();

    const seasonBox = screen.getByTestId("season-input");
    const startBox = screen.getByTestId("starts-input");
    const endBox = screen.getByTestId("ends-input");

    fireEvent.change(seasonBox, { target: { value: name } });
    fireEvent.change(startBox, { target: { value: start } });
    fireEvent.change(endBox, { target: { value: end } });

    const submit = screen.getByTestId("submit-button");
    submit.click();

    await waitFor(() => {
        expect(screen.queryByTestId("semester-form 1")).not.toBeInTheDocument();
    });
}

describe("Scheduler", () => {
    beforeEach(() => {
        render(<App />);
    });

    it("Starts with one year and a button to add more", async () => {
        const yrs = screen.getAllByTestId("Year");
        expect(yrs).toHaveLength(1);
        expect(yrs[0]).toBeInstanceOf(HTMLDivElement);
        const btn = screen.getByTestId("addYearButton");
        expect(btn).toBeInTheDocument();
        expect(btn).toBeInstanceOf(HTMLButtonElement);
    });

    it("Can add another year by pressing the button", async () => {
        let btn = screen.getByTestId("addYearButton");
        btn.click();
        let yrs = screen.getAllByTestId("Year");
        expect(yrs).toHaveLength(2);
        for (let i = 0; i < 5; i++) {
            btn = screen.getByTestId("addYearButton");
            expect(btn).toBeInTheDocument();
            btn.click();
        }
        yrs = screen.getAllByTestId("Year");
        expect(yrs).toHaveLength(7);
    });

    it("renders a form when you click on the new semester button", async () => {
        screen.getByTestId("Year 1 label").click();
        screen.getByTestId("trigger 1").click();

        const form = await screen.findByTestId("semester-form 1");
        const seasonBox = screen.getByTestId("season-input");
        const startBox = screen.getByTestId("starts-input");
        const endBox = screen.getByTestId("ends-input");

        expect(form).toBeInTheDocument();
        expect(seasonBox).toBeInTheDocument();
        expect(startBox).toBeInTheDocument();
        expect(endBox).toBeInTheDocument();

        act(() => {
            screen.getByTestId("trigger 1").click();
        });

        await waitFor(() => {
            expect(
                screen.queryByTestId("semester-form 1")
            ).not.toBeInTheDocument();
        });
    });

    it("Can display the names of semesters you add to a year.", async () => {

        screen.getByTestId("Year 1 label").click();
        screen.getByTestId("trigger 1").click();
        const form = await screen.findByTestId("semester-form 1");
        
        expect(screen.queryByText("fall")).not.toBeInTheDocument();

        expect(form).toBeInTheDocument();

        const seasonBox = screen.getByTestId("season-input");
        const startBox = screen.getByTestId("starts-input");
        const endBox = screen.getByTestId("ends-input");

        fireEvent.change(seasonBox, { target: { value: "fall" } });
        fireEvent.change(startBox, { target: { value: "2021-09-01" } });
        fireEvent.change(endBox, { target: { value: "2021-12-15" } });

        const submit = screen.getByTestId("submit-button");
        submit.click();

        expect(screen.getByText("fall")).toBeInTheDocument();
    });

    it("Should be able to remove a semester on clicking the '-' button next to the label", async () => {
        await addSemester("fall","2021-09-01","2021-12-15");

        expect(screen.getByText("fall")).toBeInTheDocument();
        screen.getByText("-").click();
        expect(screen.queryByText("fall")).not.toBeInTheDocument();
    });
});
