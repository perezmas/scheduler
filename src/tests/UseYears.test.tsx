import React, {useState} from "react";
import useYears from "../hooks/useYears";
import {v4 as uuid} from "uuid";
import {screen, render, getByTestId, getByText} from "@testing-library/react";
import { YearProps } from "../interfaces/Year";
import SemesterProps from "../interfaces/Semester";
import CourseProps from "../interfaces/Course";

export interface HookTesterProps {
    testIndex: number
    initSpy?: () => Array<YearProps>
}

function UseYearsTest(props: HookTesterProps): JSX.Element{
    switch(props.testIndex){
        case 1: {
            const years = useYears();
            return (<div>
                {years.value.map((year: YearProps, index: number) => {
                    return (<div data-testid={`Year ${index}`} key = {index}>
                            <Year uuid ={year.uuid} semesters={year.semesters} index={year.index}/>
                        </div>);
                })}
                <div data-testid="years-length">
                    {years.value.length}
                </div>
            </div>);
        }case 2: {
            const years = useYears(() => {return [{uuid: uuid(), index: 1, semesters: []}]});
            return (<div>
                {years.value.map((year: YearProps, index: number) => {
                    return (<div data-testid={`Year ${index}`} key = {index}>
                            <Year uuid ={year.uuid} semesters={year.semesters} index={year.index}/>
                        </div>);
                })}
                <div data-testid="years-length">
                    {years.value.length}
                </div>
            </div>);
        }case 3: {
            const years = useYears(props.initSpy);
            return (<div>
                {years.value.map((year: YearProps, index: number) => {
                    return (<div data-testid={`Year ${index}`} key = {index}>
                            <Year uuid ={year.uuid} semesters={year.semesters} index={year.index}/>
                        </div>);
                })}
                <div data-testid="years-length">
                    {years.value.length}
                </div>
            </div>);
        }case 4: {
            const years = useYears();
            const [push, setPush] = useState<boolean>(true);
            if(push){
                years.push(uuid(), 1);
                years.push(uuid(), 2);
                setPush(false);
            }
            return (<div>
                {years.value.map((year: YearProps, index: number) => {
                    return (<div data-testid={`Year ${index}`} key = {index}>
                            <Year uuid ={year.uuid} semesters={year.semesters} index={year.index}/>
                        </div>);
                })}
                <div data-testid="years-length">
                    {years.value.length}
                </div>
            </div>);
        }case 5: {
            const targetUuid = uuid();
            const years = useYears(() => {return [{index: 1, uuid: uuid(), semesters: []},{index: 2, uuid: targetUuid, semesters: []}]});
            const [remove, setRemove] = useState(true);
            if(remove && years.value.length > 0){
                years.removeYear(targetUuid);
                setRemove(false);
            }
            return (<div>
                {years.value.map((year: YearProps, index: number) => {
                    return (<div data-testid={`Year ${index}`} key = {index}>
                            <Year uuid ={year.uuid} semesters={year.semesters} index={year.index}/>
                        </div>);
                })}
                <div data-testid="years-length">
                    {years.value.length}
                </div>
            </div>);
        }case 6: {
            const targetUuid = uuid();
            const years = useYears(() => {return [{index: 1, uuid: targetUuid, semesters: []}]});
            const [add, setAdd] = useState(true);
            if(add){
                years.putSemester(targetUuid,uuid(),new Date("2021-08-31"), new Date("2021-12-15"), "fall");
                setAdd(false);
            };
            return (<div>
                {years.value.map((year: YearProps, index: number) => {
                    return (<div data-testid={`Year ${index}`} key = {index}>
                            <Year {...year}/>
                        </div>);
                })}
                <div data-testid="years-length">
                    {years.value.length}
                </div>
            </div>);
        }case 7: {
            const targetYearUuid = uuid();
            const targetSemesterUuid = uuid();
            const years = useYears(() => {return [{index: 1, uuid: targetYearUuid, semesters: [{name: "fall", start: new Date("2021-08-31"), end: new Date("2021-12-15"), courses: new Map<string,CourseProps>(), uuid: targetSemesterUuid}]}]});
            const [remove, setRemove] = useState(true);
            if(remove){
                years.removeSemester(targetYearUuid,targetSemesterUuid);
                setRemove(false);
            }
            return (<div>
                {years.value.map((year: YearProps, index: number) => {
                    return (<div data-testid={`Year ${index}`} key = {index}>
                            <Year {...year}/>
                        </div>);
                })}
                <div data-testid="years-length">
                    {years.value.length}
                </div>
            </div>);
        }
    default: {
        throw Error(`Unimplemented test ${props.testIndex}`);
    }
    }
}


function Year(props: YearProps): JSX.Element{
    return (
        <div>
            <div data-testid={"year-uuid"}>
                {props.uuid}
            </div>
            <div data-testid={"index"}>
                {props.index}
            </div>
            <div data-testid={"semesters"}>
                {props.semesters.length === 0 ? "[]" : props.semesters.map((semesterProps: SemesterProps, index: number) => {
                    return (<div key={index} data-testid={`Semester ${index}`}>
                        <Semester
                            {...semesterProps}
                        />
                    </div>);
                })}
            </div>
            <div data-testid="semesters-length">
                {props.semesters.length}
            </div>
        </div>
    )
}


function Semester(props: SemesterProps): JSX.Element{
    return (
        <div>
            <div data-testid={"semester-uuid"}>
                {props.uuid}
            </div>
            <div data-testid={"start"}>
                {props.start.toString()}
            </div>
            <div data-testid={"end"}>
                {props.end.toString()}
            </div>
            <div data-testid={"name"}>
                {props.name}
            </div>
            <div data-testid={"courses"}>
                {props.courses.toString()} 
            </div>
        </div>
    )
}

function expectSemesters(year: HTMLElement, expected: Array<SemesterProps>): void{
    const ln = getByTestId(year,"semesters-length");
    expect(getByText(ln,expected.length)).toBeInTheDocument();

    for(let i = 0;i < expected.length; i++){
        let semester = getByTestId(year,`Semester ${i}`);
        let entries = Object.entries(expected[i]);
        for(const entry of entries){
            if(entry[0] === "uuid"){
                expect(getByTestId(semester,"semester-uuid")).toBeInTheDocument();
            }else{
                expect(getByTestId(semester,entry[0])).toContainElement(getByText(semester,entry[1])); //Make sure start is not equal to end, or this will fail
            }
        }
    }
}

function expectYears(years: Array<[number, Array<SemesterProps>]>){
    const ln = screen.getByTestId("years-length");
    expect(getByText(ln,years.length.toString())).toBeInTheDocument();

    for(let i = 0;i < years.length;i++){
        let year = screen.getByTestId(`Year ${i}`);
        expect(getByTestId(year,"year-uuid")).toBeInTheDocument();
        const index = getByTestId(year,"index");
        expect(getByText(index,years[i][0])).toBeInTheDocument();
        if(years[i][1].length === 0){
            expect(getByTestId(year,"semesters")).toContainElement(getByText(year,"[]"));
        }else{
            expectSemesters(year,years[i][1]);
        }
    }
}

describe(useYears,() => {
    
    it("Initializes to an empty list if no argument is passed", async () => {
            render(<UseYearsTest
                testIndex={1}
            />);
            expectYears([]);
    });

    it("Initializes to the output of the function passed to useYears", async () => {
        render(<UseYearsTest
                testIndex={2}
        />);
        
        expectYears([[1,[]]]);
    });

    it("Calls the initialization function lazily", async () => {
        const spy = jest.fn(() => {
            return [{uuid: uuid(), index: 1, semesters: []}];
        });

        const {rerender} = render(<UseYearsTest
            testIndex={3}
            initSpy={spy}    
        />);

        expect(spy).toHaveBeenCalled();
        const calls = spy.mock.calls.length;

        rerender(<UseYearsTest
            testIndex={3}
            initSpy={spy}    
        />);

        expect(spy).toHaveBeenCalledTimes(calls);
    });

    it("Should be able to add years using push", async () => {
        render(<UseYearsTest
            testIndex={4}
        />);

        expectYears([[1,[]],[2,[]]]);
    });

    it("Should be able to remove years useing removeYear", async () => {
        render(<UseYearsTest
            testIndex={5}
        />);

        expectYears([[1,[]]]);
    });


    it("Should allow adding semesters to a year", async () => {
        render(<UseYearsTest
            testIndex={6}
        />);
        expectYears([[1,[{uuid: uuid(), start: new Date("2021-08-31"), end: new Date("2021-12-15"), name: "fall", courses: new Map<string, CourseProps>()}]]])
    });

    it("Should allow removing semesters from a year", async () => {
        render(<UseYearsTest
            testIndex={7}
        />);
        expectYears([[1,[]]]);
    })
});