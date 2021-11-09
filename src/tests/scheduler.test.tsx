import React from "react";
import { findByTestId, fireEvent, getByTestId, render, screen, waitFor } from "@testing-library/react";

import { act } from "react-dom/test-utils";
import { Scheduler } from "../components/Scheduler";

async function addSemester(
    name: string,
    start: string,
    end: string,
    year = 1
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
        expect(
            screen.queryByTestId(`semester-form ${year}`)
        ).not.toBeInTheDocument();
    });
}

async function addCourse(year: number, semester: number, name: string, id: string, description?: string){
    const semesterElement = screen.getByTestId(`Year ${year} semester ${semester}`);
    getByTestId(semesterElement,"add-course-button").click();

    await screen.findByTestId("course-form");

    const courseName = screen.getByLabelText("Course Name");
    const courseID = screen.getByLabelText("Course ID");
    const courseDescription = screen.getByLabelText(
        "Course Description (Optional)"
    );

    fireEvent.change(courseName, { target: { value: name } });
    fireEvent.change(courseID, { target: { value: id } });
    fireEvent.change(courseDescription, {
        target: { value: description !== undefined ? description : "" },
    });

    screen.getByText("Add Course").click();

    screen.getByTestId("close-course-form").click();


    await waitFor(() => {
        expect(
            screen.queryByTestId("course-form")
        ).not.toBeInTheDocument();
    });
}

describe("Scheduler", () => {
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

    it("Can clear all the courses in a semester", async () => {
        await addCourse(1, 1,"Irish Dance", "IRSH-201");
        await addCourse(1, 1,"Intro to Scots", "SCOT-201", "No, we don't sound like scots wikipedia.");

        const fall = screen.getByTestId("Year 1 semester 1");
        
        getByTestId(fall, "clear-courses-button").click();



    })
});
