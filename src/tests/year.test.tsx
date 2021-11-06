import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Year from "../components/Year";
import { v4 as uuid } from "uuid";
import CourseProps from "../interfaces/Course";
import { ChangeEvent, FormEvent } from "react";


describe("Year", () => {
    const doNothing = jest.fn();
    const yrUuid = uuid();
    it("Should render the label correctly", async () => {
        const { rerender } = render(
            <Year
                uuid={yrUuid}
                handleSubmit={doNothing}
                handleInput={doNothing}
                formUuid={null}
                setFormUuid={doNothing}
                index={1}
                semesters={[]}
                removeSemester={doNothing}
                clear={doNothing}
                canSubmit={false}
                formInit={doNothing}
            />
        );
        let label = screen.getByTestId("Year 1 label");
        let text = screen.getByText("Year 1 >");
        expect(text).toBe(label);
        rerender(
            <Year
                uuid={yrUuid}
                handleSubmit={doNothing}
                handleInput={doNothing}
                formUuid={null}
                setFormUuid={doNothing}
                index={3}
                semesters={[]}
                removeSemester={doNothing}
                clear={doNothing}
                canSubmit={false}
                formInit={doNothing}
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
                handleSubmit={doNothing}
                handleInput={doNothing}
                formUuid={null}
                setFormUuid={doNothing}
                index={1}
                semesters={[
                    {
                        name: "summer 2",
                        start: new Date("2022-07-11"),
                        end: new Date("2022-08-12"),
                        courses: new Map<string, CourseProps>(),
                        uuid: uuid(),
                    },
                ]}
                removeSemester={doNothing}
                clear={doNothing}
                canSubmit={false}
                formInit={doNothing}
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
                handleSubmit={doNothing}
                handleInput={doNothing}
                formUuid={null}
                setFormUuid={doNothing}
                index={1}
                semesters={[
                    {
                        name: "summer 2",
                        start: new Date("2022-07-11"),
                        end: new Date("2022-08-12"),
                        courses: new Map<string, CourseProps>(),
                        uuid: uuid(),
                    },
                    {
                        name: "spring",
                        start: new Date("2022-02-07"),
                        end: new Date("2022-05-26"),
                        courses: new Map<string, CourseProps>(),
                        uuid: uuid(),
                    },
                    {
                        name: "winter",
                        start: new Date("2022-01-03"),
                        end: new Date("2022-02-05"),
                        courses: new Map<string, CourseProps>(),
                        uuid: uuid(),
                    },
                    {
                        name: "fall",
                        start: new Date("2021-08-31"),
                        end: new Date("2021-12-18"),
                        courses: new Map<string, CourseProps>(),
                        uuid: uuid(),
                    },
                    {
                        name: "summer 1",
                        start: new Date("2022-06-06"),
                        end: new Date("2022-07-28"),
                        courses: new Map<string, CourseProps>(),
                        uuid: uuid(),
                    },
                ]}
                removeSemester={doNothing}
                clear={doNothing}
                canSubmit={false}
                formInit={doNothing}
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
        const fn = jest.fn();
        render(
            <Year
                uuid={yrUuid}
                handleSubmit={doNothing}
                handleInput={doNothing}
                formUuid={null}
                setFormUuid={doNothing}
                index={1}
                semesters={[]}
                removeSemester={doNothing}
                clear={doNothing}
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
                handleSubmit={doNothing}
                handleInput={doNothing}
                formUuid={yrUuid}
                setFormUuid={doNothing}
                index={1}
                semesters={[]}
                removeSemester={doNothing}
                clear={doNothing}
                canSubmit={true}
                formInit={formInitWatcher}
            />
        );

        expect(await screen.findByTestId("semester-form 1")).toBeInTheDocument();

        expect(formInitWatcher).not.toHaveBeenCalled();

        screen.getByTestId("form-escape").click();
        expect(formInitWatcher).toHaveBeenCalled();
        expect(tst).toBeNull();
    });

    it("Should call the function to remove a semester when the appropriate button is clicked.", async () => {
        const removeSpy = jest.fn();
        render(
            <Year
                uuid={yrUuid}
                handleSubmit={doNothing}
                handleInput={doNothing}
                formUuid={null}
                setFormUuid={doNothing}
                index={1}
                semesters={[
                    {
                        name: "summer 2",
                        start: new Date("2022-07-11"),
                        end: new Date("2022-08-12"),
                        courses: new Map<string, CourseProps>(),
                        uuid: uuid(),
                    },
                ]}
                removeSemester={removeSpy}
                clear={doNothing}
                canSubmit={false}
                formInit={doNothing}
            />
        );

        screen.getByText("-").click();
        expect(removeSpy).toHaveBeenCalled();
    });

    it("Calls the function passed to the clear prop if the clear button is clicked", async () => {
        const clearSpy = jest.fn();
        render(
            <Year
                uuid={yrUuid}
                handleSubmit={doNothing}
                handleInput={doNothing}
                formUuid={null}
                setFormUuid={doNothing}
                index={1}
                semesters={[
                    {
                        name: "summer 2",
                        start: new Date("2022-07-11"),
                        end: new Date("2022-08-12"),
                        courses: new Map<string, CourseProps>(),
                        uuid: uuid(),
                    },
                ]}
                removeSemester={doNothing}
                clear={clearSpy}
                canSubmit={false}
                formInit={doNothing}
            />
        );
        screen.getByTestId("clear-year 1").click();
        expect(clearSpy).toHaveBeenCalled();
    });

});
