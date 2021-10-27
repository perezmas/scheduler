import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import Year from "../components/Year";
import {v4 as uuid} from "uuid";
import CourseProps from "../interfaces/Course";
import { ChangeEvent, FormEvent } from "react";

let POINTLESS_GLOBAL = 1; //This is to appease the linter by avoiding doNothing being empty
function doNothing(){
    POINTLESS_GLOBAL += 1;
}

describe("Year",() => {
    const yrUuid = uuid();    
    it("Should render the label correctly", async () => {
        const {rerender} = render(
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
                semesters={
                    [
                        {name: "summer 2", start: new Date("2022-07-11"), end: new Date("2022-08-12"), courses: new Map<string,CourseProps>(), uuid: uuid()},  
                    ]
                }
                removeSemester={doNothing}
                clear={doNothing}
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
                semesters={
                    [
                        {name: "summer 2", start: new Date("2022-07-11"), end: new Date("2022-08-12"), courses: new Map<string,CourseProps>(), uuid: uuid()},
                        {name: "spring", start: new Date("2022-02-07"), end: new Date("2022-05-26"), courses: new Map<string,CourseProps>(), uuid: uuid()},
                        {name: "winter", start: new Date("2022-01-03"), end: new Date("2022-02-05"), courses: new Map<string,CourseProps>(), uuid: uuid()},
                        {name: "fall", start: new Date("2021-08-31"), end: new Date("2021-12-18"), courses: new Map<string,CourseProps>(), uuid: uuid()},
                        {name: "summer 1", start: new Date("2022-06-06"), end: new Date("2022-07-28"), courses: new Map<string,CourseProps>(), uuid: uuid()},     
                    ]
                }
                removeSemester={doNothing}
                clear={doNothing}
            />
        );

        const fall = screen.getByText("fall");
        const winter = screen.getByText("winter");
        const spring = screen.getByText("spring");
        const summer1 = screen.getByText("summer 1");
        const summer2 = screen.getByText("summer 2");

        const fallCol = screen.getByTestId("Year 1 semester 1");
        const winterCol = screen.getByTestId("Year 1 semester 2");
        const springCol = screen.getByTestId("Year 1 semester 3");
        const summer1Col = screen.getByTestId("Year 1 semester 4");
        const summer2Col = screen.getByTestId("Year 1 semester 5");

        expect(fallCol).toBe(fall);
        expect(winterCol).toBe(winter);
        expect(springCol).toBe(spring);
        expect(summer1Col).toBe(summer1);
        expect(summer2Col).toBe(summer2);
    });

    it("calls setFormUuid when you click the trigger", async () => {
        const fn = jest.fn();
        render(
            <Year 
                uuid={yrUuid}
                handleSubmit={doNothing}
                handleInput={doNothing}
                formUuid={null}
                setFormUuid={fn}
                index={1}
                semesters={[]}
                removeSemester={doNothing}
                clear={doNothing}
            />
        );
        screen.getByTestId("Year 1 label").click();
        expect(fn).not.toHaveBeenCalled();
        screen.getByTestId("trigger 1").click();

        expect(fn).toHaveBeenCalled();
    });

    it("Should render the form when the formUuid prop matches the uuid and attempt to close the form on submitting or clicking out", async () => {
        let tst: string | null = "";
        const setFormWatcher = jest.fn((uuid: string | null) => {
            tst = uuid;
        });
        render(<button data-testid="form-escape">hi</button>);
        render(
            <Year
                uuid={yrUuid}
                handleSubmit={doNothing}
                handleInput={doNothing}
                formUuid={yrUuid}
                setFormUuid={setFormWatcher}
                index={1}
                semesters={[]}
                removeSemester={doNothing}
                clear={doNothing}
            />
        );
        
        await screen.findByTestId("semester-form 1");

        const seasonBox = screen.getByTestId("season-input");
        const startBox = screen.getByTestId("starts-input");
        const endBox = screen.getByTestId("ends-input");

        expect(seasonBox).toBeInTheDocument();
        expect(startBox).toBeInTheDocument();
        expect(endBox).toBeInTheDocument();

        expect(setFormWatcher).not.toHaveBeenCalled();

        screen.getByTestId("form-escape").click();
        expect(setFormWatcher).toHaveBeenCalled();
        expect(tst).toBeNull();
    });

    it("Should call handleInput if the form is changed and handleSubmit if the form is submitted.", async () => {

        let newName: string | null = null;
        let newStart: string | null = null;
        let newEnd: string | null = null;

        const handleInputSpy = jest.fn((e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            switch(e.target.name){
            case "season": {
                newName = e.target.value;
                break;
            }case "starts": {
                newStart = e.target.value;
                break;
            }case "ends": {
                newEnd = e.target.value;
                break;
            }
            }
        });

        const handleSubmitSpy = jest.fn((e: FormEvent) => {
            e.preventDefault();
        });
        render(
            <Year
                uuid={yrUuid}
                handleSubmit={handleSubmitSpy}
                handleInput={handleInputSpy}
                formUuid={yrUuid}
                setFormUuid={doNothing}
                index={1}
                semesters={[]}
                removeSemester={doNothing}
                clear={doNothing}
            />
        );

        await screen.findByTestId("semester-form 1");
        
        const seasonBox = screen.getByTestId("season-input");
        const startBox = screen.getByTestId("starts-input");
        const endBox = screen.getByTestId("ends-input");

        fireEvent.change(seasonBox, { target: { value: "fall" } });
        expect(handleInputSpy).toHaveBeenCalledTimes(1);
        fireEvent.change(startBox, { target: { value: "2021-09-01" } });
        expect(handleInputSpy).toHaveBeenCalledTimes(2);
        fireEvent.change(endBox, { target: { value: "2021-12-15" } });
        expect(handleInputSpy).toHaveBeenCalledTimes(3);
        
        expect(handleSubmitSpy).not.toHaveBeenCalled();
        const submit = screen.getByTestId("submit-button");
        submit.click();
        expect(handleSubmitSpy).toHaveBeenCalled();
        
        expect(newName).toBe("fall");
        expect(newStart).toBe("2021-09-01");
        expect(newEnd).toBe("2021-12-15");
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
                semesters={
                    [
                        {name: "summer 2", start: new Date("2022-07-11"), end: new Date("2022-08-12"), courses: new Map<string,CourseProps>(), uuid: uuid()},  
                    ]
                }
                removeSemester={removeSpy}
                clear={doNothing}
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
                semesters={
                    [
                        {name: "summer 2", start: new Date("2022-07-11"), end: new Date("2022-08-12"), courses: new Map<string,CourseProps>(), uuid: uuid()},  
                    ]
                }
                removeSemester={doNothing}
                clear={clearSpy}
            />
        );
        screen.getByTestId("clear-year 1").click();
        expect(clearSpy).toHaveBeenCalled();

    });
    expect(typeof POINTLESS_GLOBAL).toBe("number");
});