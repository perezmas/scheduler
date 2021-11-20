import React, { FormEvent, ChangeEvent } from "react";
import Year, { FullYearProps } from "../components/Year/Year";
import { Courses } from "../hooks/useCourses";
import SemesterProps from "../interfaces/Semester";
import CourseProps from "../interfaces/Course";
import { v4 as uuid } from "uuid";
import {
    screen,
    render,
    getByTestId,
    waitFor,
    fireEvent,
} from "@testing-library/react";

async function openCourseDropdown(semester: number): Promise<void> {
    getByTestId(
        screen.getByTestId(`semester ${semester}`),
        "dropdown-toggle"
    ).click();
    await screen.findByTestId("clear-courses-button");
}

describe(Year, () => {
    const doNothingWithString = jest.fn<void, [string]>();
    const doNothing = jest.fn<void, [void]>();
    const emptySubmitHandler = jest.fn<void, [FormEvent, string]>();
    const emptyInputHandler = jest.fn<void, [ChangeEvent]>();
    const doNothingWithCourseProps = jest.fn<void, [CourseProps]>();
    const doNothingWithStringOrNull = jest.fn<void, [string | null]>();
    const doNothingWithRemoveYear = jest.fn<void, [void]>();

    const yearUuid = uuid();
    const emptyCourses: Courses = {
        courseList: [],
        removeCourse: doNothingWithString,
        push: doNothingWithCourseProps,
    };

    const defaultProps: FullYearProps = {
        removeYear: doNothingWithRemoveYear,
        clearYear: doNothing,
        removeSemester: doNothingWithString,
        courses: emptyCourses,
        index: 1,
        uuid: yearUuid,
        handleSemesterSubmit: emptySubmitHandler,
        handleSemesterInput: emptyInputHandler,
        semesters: [],
        currentForm: null,
        setForm: doNothingWithStringOrNull,
        submissionAllowed: false,
    };
    const fallUuid = uuid();
    const springUuid = uuid();
    const fall: SemesterProps = {
        name: "fall",
        start: new Date("08-31-21"),
        end: new Date("12-15-21"),
        uuid: fallUuid,
    };
    const spring: SemesterProps = {
        name: "spring",
        start: new Date("02-07-2022"),
        end: new Date("06-08-2022"),
        uuid: springUuid,
    };
    it("Displays the correct index", async () => {
        const { rerender } = render(<Year {...defaultProps} />);
        expect(screen.getByText("Year 1")).toBeInTheDocument();
        const newProps = { ...defaultProps };
        newProps.index = 3;
        rerender(<Year {...newProps} />);
        expect(screen.getByText("Year 3")).toBeInTheDocument();
        expect(screen.queryByTestId("Year 1")).not.toBeInTheDocument();
    });
    it("Can display one or more semesters", async () => {
        const newProps = { ...defaultProps };
        newProps.semesters = [fall];
        const { rerender } = render(<Year {...newProps} />);
        expect(screen.getByTestId("semester 1")).toBeInTheDocument();
        expect(screen.queryByTestId("semester 2")).not.toBeInTheDocument();
        newProps.semesters = [fall, spring];
        rerender(<Year {...newProps} />);
        expect(screen.getByTestId("semester 1")).toBeInTheDocument();
        expect(screen.getByTestId("semester 2")).toBeInTheDocument();
        expect(screen.queryByTestId("semester 3")).not.toBeInTheDocument();
    });
    it("Calls the function to remove a semester if the remove button on a semester is clicked.", async () => {
        const removeSemesterSpy = jest.fn<void, [string]>();
        const newProps = { ...defaultProps };
        newProps.semesters = [fall, spring];
        newProps.removeSemester = removeSemesterSpy;
        render(<Year {...newProps} />);
        await openCourseDropdown(1);
        expect(removeSemesterSpy).not.toHaveBeenCalled();
        getByTestId(
            screen.getByTestId("semester 1"),
            "remove-semester"
        ).click();
        expect(removeSemesterSpy).toHaveBeenCalled();
        expect(removeSemesterSpy).toHaveBeenLastCalledWith(fallUuid); //semester 1 is fall because they are ordered by start dates.
    });
    it("Calls the clearYear function if the clear button is clicked", async () => {
        const clearYearSpy = jest.fn<void, [void]>();
        const newProps = { ...defaultProps };
        newProps.clearYear = clearYearSpy;
        render(<Year {...newProps} />);
        expect(clearYearSpy).not.toHaveBeenCalled();
        screen.getByTestId("clear-year 1").click();
        expect(clearYearSpy).toHaveBeenCalled();
    });
    it("Displays the form to add a new semester to the year iff the currentForm is set to uuid of a semester in the year", async () => {
        const newProps = { ...defaultProps };
        newProps.currentForm = yearUuid;
        const { rerender } = render(<Year {...newProps} />);
        await screen.findByTestId("popover");
        newProps.currentForm = null;
        rerender(<Year {...newProps} />);
        await waitFor(() => {
            expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
        });
        newProps.currentForm = "x";
        rerender(<Year {...newProps} />);
        expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
    });
    it("Calls setForm with the year's uuid if the open-semester-form is clicked while the form is closed", async () => {
        const setFormSpy = jest.fn<void, [string | null]>();
        const newProps = { ...defaultProps };
        newProps.setForm = setFormSpy;
        render(<Year {...newProps} />);
        expect(setFormSpy).not.toHaveBeenCalled();
        screen.getByTestId("open-semester-form").click();
        expect(setFormSpy).toHaveBeenCalled();
        expect(setFormSpy).toHaveBeenLastCalledWith(yearUuid);
    });
    it("Calls setForm with null if the open-semester-form is clicked while the form is closed", async () => {
        const setFormSpy = jest.fn<void, [string | null]>();
        const newProps = { ...defaultProps };
        newProps.setForm = setFormSpy;
        newProps.currentForm = yearUuid;
        render(<Year {...newProps} />);
        await screen.findByTestId("popover");
        expect(setFormSpy).not.toHaveBeenCalled();
        screen.getByTestId("open-semester-form").click();
        expect(setFormSpy).toHaveBeenCalled();
        expect(setFormSpy).toHaveBeenLastCalledWith(null);
    });
    it("Calls the form submission handler iff the button to submit the form is clicked while submission is allowed", async () => {
        const handleSemesterSubmitSpy = jest.fn<void, [FormEvent]>(
            (e: FormEvent) => {
                e.preventDefault();
            }
        );
        const newProps = { ...defaultProps };
        newProps.handleSemesterSubmit = handleSemesterSubmitSpy;
        newProps.currentForm = yearUuid;
        const { rerender } = render(<Year {...newProps} />);
        await screen.findByTestId("popover");
        screen.getByTestId("submit-button").click();
        expect(handleSemesterSubmitSpy).not.toHaveBeenCalled();
        newProps.submissionAllowed = true;
        rerender(<Year {...newProps} />);
        screen.getByTestId("submit-button").click();
        expect(handleSemesterSubmitSpy).toHaveBeenCalled();
    });
    it("Correctly recieves input from the semester form", async () => {
        const handleSemesterInputSpy = jest.fn<void, [ChangeEvent]>(
            (e: ChangeEvent) => {
                e.preventDefault();
            }
        );
        const newProps = { ...defaultProps };
        newProps.handleSemesterInput = handleSemesterInputSpy;
        newProps.currentForm = yearUuid;
        render(<Year {...newProps} />);
        await screen.findByTestId("popover");
        const seasonBox = screen.getByTestId("season-input");
        const startBox = screen.getByTestId("starts-input");
        const endBox = screen.getByTestId("ends-input");

        expect(handleSemesterInputSpy).not.toHaveBeenCalled();

        fireEvent.change(seasonBox, { target: { value: "fall" } });
        expect(handleSemesterInputSpy).toHaveBeenCalledTimes(1);
        expect(handleSemesterInputSpy).toHaveBeenLastCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({ value: "fall" }),
            })
        );
        fireEvent.change(startBox, { target: { value: "2021-09-01" } });
        expect(handleSemesterInputSpy).toHaveBeenCalledTimes(2);
        expect(handleSemesterInputSpy).toHaveBeenLastCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({ value: "2021-09-01" }),
            })
        );
        fireEvent.change(endBox, { target: { value: "2021-12-15" } });
        expect(handleSemesterInputSpy).toHaveBeenCalledTimes(3);
        expect(handleSemesterInputSpy).toHaveBeenLastCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({ value: "2021-12-15" }),
            })
        );
    });
});
