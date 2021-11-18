import React, {FormEvent, ChangeEvent} from "react";
import Year from "../components/Year/Year";
import {Courses} from "../hooks/useCourses";
import SemesterProps from "../interfaces/Semester";
import CourseProps from "../interfaces/Course";
import {v4 as uuid} from "uuid";
import {screen, render, getByTestId, waitFor} from "@testing-library/react";

//Copied from Year.tsx so I don't have to export it just for a test.
interface YearProps{
    clearYears: (uuid?: string) => void
    removeSemester: (uuid: string) => void,
    courses: Courses,
    index: number,
    uuid: string,
    handleSemesterSubmit: (event: FormEvent<HTMLFormElement>, uuid: string) => void,
    handleSemesterInput: (event: ChangeEvent<HTMLInputElement>) => void,
    semesters: Array<SemesterProps>,
    currentForm: string | null,
    setForm: (newForm: string | null) => void,
    submissionAllowed: boolean
}

describe(Year, () => {
    const doNothingWithString = jest.fn<void, [string]>();
    const doNothingWithOptionalString = jest.fn<void, [string | undefined]>();
    const emptySubmitHandler = jest.fn<void, [FormEvent, string]>();
    const emptyInputHandler = jest.fn<void, [ChangeEvent]>();
    const doNothingWithCourseProps = jest.fn<void, [CourseProps]>();
    const doNothingWithStringOrNull = jest.fn<void, [string | null]>();
    const yearUuid = uuid();
    const emptyCourses: Courses = {
        courseList: [],
        removeCourse: doNothingWithString,
        push: doNothingWithCourseProps
    };
    
    const defaultProps: YearProps = {
        clearYears: doNothingWithOptionalString,
        removeSemester: doNothingWithString,
        courses: emptyCourses,
        index: 1,
        uuid: yearUuid,
        handleSemesterSubmit: emptySubmitHandler,
        handleSemesterInput: emptyInputHandler,
        semesters: [],
        currentForm: null,
        setForm: doNothingWithStringOrNull,
        submissionAllowed: false
    };
    const fallUuid = uuid();
    const springUuid = uuid();
    const fall: SemesterProps = {name: "fall", start: new Date("08-31-21"), end: new Date("12-15-21"), uuid: fallUuid};
    const spring: SemesterProps = {name: "spring", start: new Date("02-07-2022"), end: new Date("06-08-2022"), uuid: springUuid}
    it("Displays the correct index", async () => {
        const {rerender} = render(<Year {...defaultProps}/>);
        expect(screen.getByText("Year 1 >")).toBeInTheDocument();
        const newProps = {...defaultProps};
        newProps.index = 3;
        rerender(<Year {...newProps}/>);
        expect(screen.getByText("Year 3 >")).toBeInTheDocument();
        expect(screen.queryByTestId("Year 1 >")).not.toBeInTheDocument();
    });
    it("Can display one or more semesters", async () => {
        const newProps = {...defaultProps}
        newProps.semesters = [fall];
        const {rerender} = render(<Year {...newProps}/>);
        expect(screen.getByTestId("semester 1")).toBeInTheDocument();
        expect(screen.queryByTestId("semester 2")).not.toBeInTheDocument();
        newProps.semesters = [fall, spring];
        rerender(<Year {...newProps}/>);
        expect(screen.getByTestId("semester 1")).toBeInTheDocument();
        expect(screen.getByTestId("semester 2")).toBeInTheDocument();
        expect(screen.queryByTestId("semester 3")).not.toBeInTheDocument();
    });
    it("Calls the function to remove a semester if the remove button on a semester is clicked.", async () => {
        const removeSemesterSpy = jest.fn<void, [string]>();
        const newProps = {...defaultProps};
        newProps.semesters = [fall, spring];
        newProps.removeSemester = removeSemesterSpy;
        render(<Year {...newProps}/>);
        expect(removeSemesterSpy).not.toHaveBeenCalled();
        getByTestId(screen.getByTestId("semester 1"),"remove-semester").click();
        expect(removeSemesterSpy).toHaveBeenCalled();
        expect(removeSemesterSpy).toHaveBeenLastCalledWith(fallUuid); //semester 1 is fall because they are ordered by start dates.
    });
    it("Displays the form to add a new semester to the year iff the currentForm is set to uuid of a semester in the year", async () => {
       const newProps = {...defaultProps};
       newProps.currentForm = yearUuid;
       const {rerender} = render(<Year {...newProps}/>);
       await screen.findByTestId("popover");
       newProps.currentForm = null;
       rerender(<Year {...newProps}/>);
       await waitFor(() => {
           expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
       });
       newProps.currentForm = "x";
       rerender(<Year {...newProps}/>);
       expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
    });
});