import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { act } from "react-dom/test-utils";
import { Scheduler } from "../components/Scheduler";

async function addSemester(
    name: string,
    start: string,
    end: string,
    year: number = 1
): Promise<void> {
    screen.getByTestId(`trigger ${year}`).click();
    const form = await screen.findByTestId(`semester-form ${year}`);

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
        expect(screen.queryByTestId(`semester-form ${year}`)).not.toBeInTheDocument();
    });
}

describe("Scheduler", () => {
    beforeEach(() => {
        render(<Scheduler />);
    });

    it("Starts with one year and a button to add more", async () => {
        const yrs = screen.getAllByTestId("Year");
        expect(yrs).toHaveLength(1);
        expect(yrs[0]).toBeInstanceOf(HTMLDivElement);
        const btn = screen.getByTestId("add-year-button");
        expect(btn).toBeInTheDocument();
        expect(btn).toBeInstanceOf(HTMLButtonElement);
    });

    it("Can add another year by pressing the button", async () => {
        let btn = screen.getByTestId("add-year-button");
        btn.click();
        let yrs = screen.getAllByTestId("Year");
        expect(yrs).toHaveLength(2);
        for (let i = 0; i < 5; i++) {
            btn = screen.getByTestId("add-year-button");
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

    it("Removes all the semesters in the plan when the clear button is clicked", async () => {
        screen.getByTestId("add-year-button").click();
        await addSemester("fall","2021-09-01","2021-12-15");
        await addSemester("spring","2022-02-07","2022-05-26");
        await addSemester("fall","2022-09-01","2022-12-15",2);
        await addSemester("spring","2023-02-07","2023-05-26",2);
        screen.getByTestId("clear-button").click();

        expect(screen.queryByText("fall")).not.toBeInTheDocument();
        expect(screen.queryByText("spring")).not.toBeInTheDocument();
    });

    it("Removes all the semesters in a year when the clear button for a year is clicked", async () => {
        screen.getByTestId("add-year-button").click();
        await addSemester("fall","2021-09-01","2021-12-15");
        await addSemester("spring","2022-02-07","2022-05-26");
        await addSemester("fall","2022-09-01","2022-12-15",2);
        await addSemester("spring","2023-02-07","2023-05-26",2);
        screen.getByTestId("clear-year 1").click();

        expect(screen.getAllByText("fall")).toHaveLength(1);
        expect(screen.getAllByText("spring")).toHaveLength(1);

    })
});
