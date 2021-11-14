import React, { FormEvent, ChangeEvent } from "react";
import { getByTestId, render, screen } from "@testing-library/react";
import Year from "../components/Year";
import { v4 as uuid } from "uuid";
import CourseProps from "../interfaces/Course";
import { CourseAction, Courses } from "../hooks/useCourses";

describe(Year, () => {
    const doNothing = jest.fn<void, [void]>();
    const yrUuid = uuid();
    const emptyCourses: Courses = {
        courseList: new Map<string, CourseProps>(),
        removeCourse: jest.fn<void, [string]>(),
        updateCourses: jest.fn<void, [CourseAction]>(),
    };
    const noFormEvent = jest.fn<void, [FormEvent<HTMLFormElement>]>((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    });
    const noChangeEvent = jest.fn<void, [ChangeEvent<HTMLInputElement>]>((e: ChangeEvent) => {
        e.preventDefault();
    });

    const doNothingWithString = jest.fn<void, [string | null]>();
    it("Should render the label correctly", async () => {
        const { rerender } = render(
            <Year
                uuid={yrUuid}
                handleSubmit={noFormEvent}
                handleInput={noChangeEvent}
                formUuid={null}
                index={1}
                semesters={[]}
                removeSemester={doNothingWithString}
                clear={doNothing}
                courses={emptyCourses}
                clearCourses={doNothingWithString}
                canSubmit={false}
                formInit={doNothingWithString}
            />
        );
        let label = screen.getByTestId("Year 1 label");
        let text = screen.getByText("Year 1 >");
        expect(text).toBe(label);
        rerender(
            <Year
                uuid={yrUuid}
                handleSubmit={noFormEvent}
                handleInput={noChangeEvent}
                formUuid={null}
                index={3}
                semesters={[]}
                removeSemester={doNothingWithString}
                clear={doNothing}
                courses={emptyCourses}
                clearCourses={doNothingWithString}
                canSubmit={false}
                formInit={doNothingWithString}
            />
        );
        expect(screen.queryByTestId("Year 1 label")).not.toBeInTheDocument();
        expect(screen.queryByText("Year 1 >")).not.toBeInTheDocument();

        label = screen.getByTestId("Year 3 label");
        text = screen.getByText("Year 3 >");
        expect(text).toBe(label);
    });

    it("Should be able to render a semester", async () => {
        render(
            <Year
                uuid={yrUuid}
                handleSubmit={noFormEvent}
                handleInput={noChangeEvent}
                formUuid={null}
                index={1}
                semesters={[
                    {
                        name: "summer 2",
                        start: new Date("2022-07-11"),
                        end: new Date("2022-08-12"),
                        uuid: uuid(),
                    },
                ]}
                removeSemester={doNothingWithString}
                clear={doNothing}
                clearCourses={doNothingWithString}
                courses={emptyCourses}
                canSubmit={false}
                formInit={doNothingWithString}
            />
        );

        const semesterLabel = screen.getByText("summer 2");
        const minusButton = screen.getByText("-");

        expect(semesterLabel).toBeInTheDocument();
        expect(minusButton).toBeInTheDocument();
    });

    it("Should be able to several semesters, and they should be sorted by their starting dates.", async () => {
        render(
            <Year
                uuid={yrUuid}
                handleSubmit={noFormEvent}
                handleInput={noChangeEvent}
                formUuid={null}
                
                index={1}
                semesters={[
                    {
                        name: "summer 2",
                        start: new Date("2022-07-11"),
                        end: new Date("2022-08-12"),
                        uuid: uuid(),
                    },
                    {
                        name: "spring",
                        start: new Date("2022-02-07"),
                        end: new Date("2022-05-26"),
                        uuid: uuid(),
                    },
                    {
                        name: "winter",
                        start: new Date("2022-01-03"),
                        end: new Date("2022-02-05"),
                        uuid: uuid(),
                    },
                    {
                        name: "fall",
                        start: new Date("2021-08-31"),
                        end: new Date("2021-12-18"),
                        uuid: uuid(),
                    },
                    {
                        name: "summer 1",
                        start: new Date("2022-06-06"),
                        end: new Date("2022-07-28"),
                        uuid: uuid(),
                    },
                ]}
                removeSemester={doNothingWithString}
                clear={doNothing}
                courses={emptyCourses}
                clearCourses={doNothingWithString}
                canSubmit={false}
                formInit={doNothingWithString}
            />
        );

        const fall = screen.getByTestId("Semester fall 2021");
        const winter = screen.getByTestId("Semester winter 2022");
        const spring = screen.getByTestId("Semester spring 2022");
        const summer1 = screen.getByTestId("Semester summer 1 2022");
        const summer2 = screen.getByTestId("Semester summer 2 2022");

        const fallCol = screen.getByTestId("Year 1 semester 1");
        const winterCol = screen.getByTestId("Year 1 semester 2");
        const springCol = screen.getByTestId("Year 1 semester 3");
        const summer1Col = screen.getByTestId("Year 1 semester 4");
        const summer2Col = screen.getByTestId("Year 1 semester 5");

        expect(fallCol).toContainElement(fall);
        expect(winterCol).toContainElement(winter);
        expect(springCol).toContainElement(spring);
        expect(summer1Col).toContainElement(summer1);
        expect(summer2Col).toContainElement(summer2);
    });

    it("calls formInit when you click the trigger", async () => {
        const fn = jest.fn<void, [string | null]>();
        render(
            <Year
                uuid={yrUuid}
                handleSubmit={noFormEvent}
                handleInput={noChangeEvent}
                formUuid={null}
                index={1}
                semesters={[]}
                removeSemester={doNothingWithString}
                clear={doNothing}
                courses={emptyCourses}
                clearCourses={doNothingWithString}
                canSubmit={false}
                formInit={fn}
            />
        );
        screen.getByTestId("Year 1 label").click();
        expect(fn).not.toHaveBeenCalled();
        screen.getByTestId("trigger 1").click();

        expect(fn).toHaveBeenCalled();
    });

    it("Should render the form when the formUuid prop matches the uuid and attempt to close the form on clicking out.", async () => {
        let tst: string | null = "";
        const formInitWatcher = jest.fn((uuid: string | null) => {
            tst = uuid;
        });
        render(<button data-testid="form-escape">hi</button>);
        render(
            <Year
                uuid={yrUuid}
                handleSubmit={noFormEvent}
                handleInput={noChangeEvent}
                formUuid={yrUuid}
                index={1}
                semesters={[]}
                removeSemester={doNothingWithString}
                clear={doNothing}
                courses={emptyCourses}
                clearCourses={doNothingWithString}
                canSubmit={true}
                formInit={formInitWatcher}
            />
        );

        expect(
            await screen.findByTestId("semester-form 1")
        ).toBeInTheDocument();

        expect(formInitWatcher).not.toHaveBeenCalled();

        screen.getByTestId("form-escape").click();
        expect(formInitWatcher).toHaveBeenCalled();
        expect(tst).toBeNull();
    });

    it("Should call the function to remove a semester when the appropriate button is clicked.", async () => {
        const removeSpy = jest.fn<void, [string]>();
        render(
            <Year
                uuid={yrUuid}
                handleSubmit={noFormEvent}
                handleInput={noChangeEvent}
                formUuid={null}
                index={1}
                semesters={[
                    {
                        name: "summer 2",
                        start: new Date("2022-07-11"),
                        end: new Date("2022-08-12"),
                        uuid: uuid(),
                    },
                ]}
                removeSemester={removeSpy}
                clear={doNothing}
                courses={emptyCourses}
                clearCourses={doNothingWithString}
                canSubmit={false}
                formInit={doNothingWithString}
            />
        );

        screen.getByText("-").click();
        expect(removeSpy).toHaveBeenCalled();
    });

    it("Calls the function passed to the clear prop if the clear button is clicked", async () => {
        const clearSpy = jest.fn<void, [void]>();
        render(
            <Year
                uuid={yrUuid}
                handleSubmit={noFormEvent}
                handleInput={noChangeEvent}
                formUuid={null}
                
                index={1}
                semesters={[
                    {
                        name: "summer 2",
                        start: new Date("2022-07-11"),
                        end: new Date("2022-08-12"),
                        uuid: uuid(),
                    },
                ]}
                removeSemester={doNothingWithString}
                clear={clearSpy}
                courses={emptyCourses}
                clearCourses={doNothingWithString}
                canSubmit={false}
                formInit={doNothingWithString}
            />
        );
        screen.getByTestId("clear-year 1").click();
        expect(clearSpy).toHaveBeenCalled();
    });

    it("calls the clear function passed to it when a Semester child's clear-courses-button is clicked", async () => {
        const clearCoursesSpy = jest.fn<void, [string]>();
        const newSemesterUuid = uuid();
        render(
            <Year
                uuid={yrUuid}
                handleSubmit={noFormEvent}
                handleInput={noChangeEvent}
                formUuid={null}
                
                index={1}
                semesters={[
                    {
                        name: "summer 2",
                        start: new Date("2022-07-11"),
                        end: new Date("2022-08-12"),
                        uuid: newSemesterUuid,
                    },
                ]}
                removeSemester={doNothingWithString}
                clear={doNothing}
                courses={emptyCourses}
                clearCourses={clearCoursesSpy}
                canSubmit={false}
                formInit={doNothingWithString}
            />
        );
        expect(clearCoursesSpy).not.toHaveBeenCalled();
        getByTestId(screen.getByTestId("Year 1 semester 1"),"clear-courses-button").click();
        expect(clearCoursesSpy).toHaveBeenCalled();
    });
    it("Correctly passes the clearCourses prop to all of its Semesters", async () => {
        const clearCoursesSpy = jest.fn<void, [string]>();
        const springUuid = uuid();
        const summer2Uuid = uuid();
        render(
            <Year
                uuid={yrUuid}
                handleSubmit={noFormEvent}
                handleInput={noChangeEvent}
                formUuid={null}
                
                index={1}
                semesters={[
                    {
                        name: "summer 2",
                        start: new Date("2022-07-11"),
                        end: new Date("2022-08-12"),
                        uuid: summer2Uuid,
                    },
                    {
                        name: "spring",
                        start: new Date("2021-07-11"),
                        end: new Date("2021-08-12"),
                        uuid: springUuid
                    }
                ]}
                removeSemester={doNothingWithString}
                clear={doNothing}
                courses={emptyCourses}
                clearCourses={clearCoursesSpy}
                canSubmit={false}
                formInit={doNothingWithString}
            />
        );


        const spring = screen.getByTestId("Year 1 semester 1");
        expect(clearCoursesSpy).not.toHaveBeenCalled();
        getByTestId(spring,"clear-courses-button").click();
        expect(clearCoursesSpy).toHaveBeenCalled();
        
        const summer2 = screen.getByTestId("Year 1 semester 2");
        expect(clearCoursesSpy).toHaveBeenCalledTimes(1);
        getByTestId(summer2,"clear-courses-button").click();
        expect(clearCoursesSpy).toHaveBeenCalledTimes(2);
    });
});
