import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { act } from "react-dom/test-utils";
import { Scheduler } from "../components/Scheduler";

async function addSemester(
    name: string,
    start: string,
    end: string,
    year = 1
): Promise<void> {
    await openForm(year);

    const seasonBox = screen.getByTestId("season-input");
    const startBox = screen.getByTestId("starts-input");
    const endBox = screen.getByTestId("ends-input");

    fireEvent.change(seasonBox, { target: { value: name } });
    fireEvent.change(startBox, { target: { value: start } });
    fireEvent.change(endBox, { target: { value: end } });

    expect(screen.queryAllByTestId("error")).toHaveLength(0);

    const submit = screen.getByTestId("submit-button");
    submit.click();

    await waitFor(() => {
        expect(
            screen.queryByTestId(`semester-form ${year}`)
        ).not.toBeInTheDocument();
    });
}

async function openForm(year: number): Promise<void>{
    screen.getByTestId(`trigger ${year}`).click();
    await screen.findByTestId(`semester-form ${year}`);
}

async function testForError(baseline: [string, string], errorConditions: Array<["starts-input" | "ends-input",string]>, expectError: () => void, expectNoError: () => void, year = 1){
    await openForm(year);

    const startsBox = screen.getByTestId("starts-input");
    const endsBox = screen.getByTestId("ends-input");
    fireEvent.change(startsBox, {target: {value: baseline[0]}});
    fireEvent.change(endsBox, {target: {value: baseline[1]}});
    expectNoError();

    for(const condition of errorConditions){
        const box = condition[0] === "starts-input" ? startsBox : endsBox;
        fireEvent.change(box,{target: {value: condition[1]}});
        expectError();

        fireEvent.change(box,{target: {value: box === startsBox ? baseline[0] : baseline[1]}});
        expectNoError();
    }


}

describe(Scheduler,() => {
    const currentYear = new Date().getUTCFullYear();
    beforeEach(() => {
        render(<Scheduler />);
    });

    it("Starts with a default page with the first 3 semesters in a standard plan", async () => {
        const yrs = screen.getAllByTestId("Year");
        expect(yrs).toHaveLength(2);
        expect(screen.getAllByText("fall")).toHaveLength(2);
        expect(screen.getAllByText("spring")).toHaveLength(1);

        expect(screen.getByTestId("clear-button")).toBeInTheDocument();
        expect(
            screen.getByTestId(`Semester fall ${currentYear}`)
        ).toBeInTheDocument();
        expect(
            screen.getByTestId(`Semester spring ${currentYear + 1}`)
        ).toBeInTheDocument();
        expect(
            screen.getByTestId(`Semester spring ${currentYear + 1}`)
        ).toBeInTheDocument();
    });

    it("Can add another year by pressing the button", async () => {
        let btn = screen.getByTestId("add-year-button");
        btn.click();
        expect(screen.getByTestId("Year 3 label")).toBeInTheDocument();
        for (let i = 0; i < 5; i++) {
            btn = screen.getByTestId("add-year-button");
            btn.click();
            expect(
                screen.getByTestId(`Year ${4 + i} label`)
            ).toBeInTheDocument();
        }
    });

    it("renders a form when you click on the new semester button", async () => {
        await openForm(1);

        const seasonBox = screen.getByTestId("season-input");
        const startBox = screen.getByTestId("starts-input");
        const endBox = screen.getByTestId("ends-input");

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

    it("Allows you to submit the form iff all the fields are filled and there are no errors.", async () => {
        await openForm(1);
        const submit = screen.getByTestId("submit-button");
        const expectNoSubmission = () => {
            submit.click();
            expect(screen.queryByText("winter")).not.toBeInTheDocument();
            expect(screen.getByTestId("semester-form 1")).toBeInTheDocument();
        };


        const seasonBox = screen.getByTestId("season-input");
        const startsBox = screen.getByTestId("starts-input");
        const endsBox = screen.getByTestId("ends-input");
        expectNoSubmission();

        fireEvent.change(seasonBox,{target: {value: "winter"}});
        expectNoSubmission();

        fireEvent.change(endsBox, {target: {value: "2022-02-05"}});
        expectNoSubmission();

        fireEvent.change(endsBox, {target: {value: ""}});
        fireEvent.change(startsBox, {target: {value: "2022-01-03"}});
        expectNoSubmission();

        fireEvent.change(endsBox, {target: {value: "2022-01-01"}});
        expectNoSubmission();

        fireEvent.change(endsBox, {target: {value: "2022-02-05"}});
        submit.click();

        expect(screen.getByText("winter")).toBeInTheDocument();
        expect(screen.queryByTestId("semester-form 1")).not.toBeInTheDocument();
    });

    it("Allows you to add semesters to a year.", async () => {
        expect(
            screen.queryByTestId("Semester summer 2019")
        ).not.toBeInTheDocument();

        await addSemester("summer", "2019-09-01", "2019-12-15");

        expect(
            screen.queryByTestId("Semester summer 2019")
        ).toBeInTheDocument();
    });

    it("Should be able to remove a semester on clicking the '-' button next to the label", async () => {
        screen.getByTestId(`Remove Semester fall ${currentYear}`).click();
        expect(
            screen.queryByTestId(`Semester fall ${currentYear}`)
        ).not.toBeInTheDocument();
    });

    it("Removes all the semesters in the plan when the clear button is clicked", async () => {
        screen.getByTestId("clear-button").click();

        expect(screen.queryByText("fall")).not.toBeInTheDocument();
        expect(screen.queryByText("spring")).not.toBeInTheDocument();
    });

    it("Removes all the semesters in a year when the clear button for a year is clicked", async () => {
        screen.getByTestId("add-year-button").click();
        screen.getByTestId("clear-year 1").click();

        expect(screen.getAllByText("fall")).toHaveLength(1);
    });

    it("Displays an error when the user enters a date into the starts field of a semester form that overlaps an existing semester.", async () => {
        await openForm(1);

        const startsBox = screen.getByTestId("starts-input");
        expect(screen.queryByText("starts overlaps with fall")).not.toBeInTheDocument();
        fireEvent.change(startsBox,{target: {value: "2021-10-10"}});
        expect(screen.getByText("starts overlaps with fall")).toBeInTheDocument();
        expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    it("Displays an error when the user enters a date into the ends field of a semester form that overlaps an existing semester", async () => {
        await openForm(1);

        const endsBox = screen.getByTestId("ends-input");
        expect(screen.queryByText("starts overlaps with fall")).not.toBeInTheDocument();
        fireEvent.change(endsBox,{target: {value: "2021-10-10"}});
        expect(screen.getByText("ends overlaps with fall")).toBeInTheDocument();
        expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    it("Displays an error if the user tries to create a semester that starts after it ends.", async () => {
        const expectError = () => {
            expect(screen.getByText("Semesters cannot start after they end!")).toBeInTheDocument();
            expect(screen.getByTestId("error")).toBeInTheDocument();
        };

        const expectNoError = () => {
            expect(screen.queryByText("Semesters cannot start after they end!")).not.toBeInTheDocument();
            expect(screen.queryByTestId("error")).not.toBeInTheDocument();
        };

        await testForError(["2022-08-31","2022-12-15"],[["starts-input","2022-12-16"],["ends-input","2022-08-30"]],expectError,expectNoError);
        
    });
    
    it("Displays an error if the user tries to add a semester that overlaps an existing one.", async () => {
        const expectError = () => {
            expect(screen.getByTestId("error")).toBeInTheDocument();
            const fallOverlap = screen.queryByText("Semester overlaps fall");
            const springOverlap = screen.queryByText("Semester overlaps spring");

            if(fallOverlap === null && springOverlap === null){
                fail("Expected an overlap error");
            }
        };
    
        const expectNoError = () => {
            expect(screen.queryByText("Semester overlaps fall")).not.toBeInTheDocument();
            expect(screen.queryByTestId("error")).not.toBeInTheDocument();
        };

        await testForError(["2021-12-16","2022-01-03"],[["starts-input","2021-12-15"],["ends-input","2022-02-08"]],expectError,expectNoError);
    });

    it("Displays a warning iff a semester is three weeks or shorter.", async () => {
        const expectWarning = () => {
            expect(screen.getByTestId("warning")).toBeInTheDocument();
            expect(screen.getByText("Semester is less than three weeks long; is this a mistake?")).toBeInTheDocument();
        };

        const expectNoWarning = () => {
            expect(screen.queryByTestId("warning")).not.toBeInTheDocument();
            expect(screen.queryByText("Semester is less than three weeks long; is this a mistake?")).not.toBeInTheDocument();
        };

        await testForError(["2022-08-31","2022-12-15"], [["ends-input","2022-09-14"],["starts-input","2022-11-24"]],expectWarning,expectNoWarning);

    });
});
