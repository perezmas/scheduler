import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useYears, { getByUUID } from "../hooks/useYears";
import { v4 as uuid } from "uuid";
import { YearProps } from "../interfaces/Year";
import useProblems, { Problem } from "../hooks/useProblems";
import ErrorStack from "./ErrorStack";
import useCourses from "../hooks/useCourses";
import { Table } from "react-bootstrap";
import {handleSemesterFormInput, handleSemesterFormSubmit} from "../util/events/SemesterFormEvents";
import Year from "./Year/Year";

interface SchedulerProps {
    /**All the course ID's for the requirements for the degree this scheduler is designed to help acquire. */
    requirements: Array<string>;
}

function getStartingYears(): Array<YearProps> {
    const year = new Date().getFullYear();

    const output = new Array<YearProps>();
    const yearOne: YearProps = { index: 1, uuid: uuid(), semesters: [] };
    yearOne.semesters.push({
        uuid: uuid(),
        name: "fall",
        start: new Date(`${year}-08-31`),
        end: new Date(`${year}-12-15`),
    });
    yearOne.semesters.push({
        uuid: uuid(),
        name: "spring",
        start: new Date(`${year + 1}-02-07`),
        end: new Date(`${year + 1}-05-26`),
    });
    const yearTwo: YearProps = { index: 2, uuid: uuid(), semesters: [] };
    yearTwo.semesters.push({
        uuid: uuid(),
        name: "fall",
        start: new Date(`${year + 1}-08-31`),
        end: new Date(`${year + 1}-12-15`),
    });
    output.push(yearOne);
    output.push(yearTwo);
    return output;
}

function hasError(problems: Array<Problem>): boolean {
    for (const problem of problems) {
        if (problem.error) {
            return true;
        }
    }
    return false;
}



export function Scheduler(props: SchedulerProps): JSX.Element {
    const years = useYears(getStartingYears);

    const courses = useCourses();
    //The requirements for the degree that are not present in the plan
    const [unmetRequirements, setUnmetRequirements] = useState<Array<string>>([]);
    //The name of the new semester (null if the form is closed or nothing has been entered)
    const [newName, setNewName] = useState<string | null>(null);
    //The starting date of the new semester as a string (null if the form is closed or nothing has been entered)
    const [newStart, setNewStart] = useState<string | null>(null);
    //The ending date of the new semester as a string (null if the form is closed or nothing has been entered)
    const [newEnd, setNewEnd] = useState<string | null>(null);
    //The semester form that is currently open; kept track of here to ensure no more than 1 of these forms can be active at once
    const [currentForm, setCurrentForm] = useState<string | null>(null);
    //Whether or not the form to create a new semester can be submitted
    const [submissionAllowed, setSubmissionAllowed] = useState(false);
    //The problems with the user's current inputs
    const problems = useProblems();
    const setForm = (uuid: string | null) => {
        setCurrentForm(uuid);
        setSubmissionAllowed(false);
        setNewName(null);
        setNewStart(null);
        setNewEnd(null);
        problems.clear("semester-form");
    };
    const handleSemesterInput = (event: ChangeEvent<HTMLInputElement>) => {
        handleSemesterFormInput(event,newStart,newEnd,setNewName,setNewStart,setNewEnd,years,currentForm,problems);
    };

    const handleSemesterSubmit = (event: FormEvent<HTMLFormElement>, id: string) => {
        handleSemesterFormSubmit(event,id,newName,newStart,newEnd,() => {
            setForm(null);
        },years.putSemester);
    };

    //set if courses match requirements using props.requirements
    useEffect(() => {
        const requirements = props.requirements;
        const newCourses = Array<string>();

        for (const requirement of requirements) {
            if (getByUUID(courses.courseList, requirement) === -1) {
                newCourses.push(requirement);
            }
        }
        setUnmetRequirements(newCourses);
    }, [props.requirements, courses.courseList]);

    if (
        newName &&
            newEnd &&
            newStart &&
            !submissionAllowed &&
            !hasError(problems.value)
    ) {
        setSubmissionAllowed(true);
    } else if (
        (!newName || !newEnd || !newStart || hasError(problems.value)) &&
            submissionAllowed
    ) {
        setSubmissionAllowed(false);
    }
    return (
        <>
            <button
                onClick={() => {
                    years.clear();
                }}
                data-testid="clear-button"
            >
                    Clear
            </button>
            <div>
                {years.value.map((props: YearProps) => {
                    return (
                        <Year
                            key={props.uuid}
                            clearYear = {() => {
                                years.clear(props.uuid);
                            }}
                            removeSemester={(semesterUuid: string) => {
                                years.removeSemester(props.uuid,semesterUuid);
                            }}
                            courses={courses}
                            index={props.index}
                            uuid={props.uuid}
                            handleSemesterSubmit={handleSemesterSubmit}
                            handleSemesterInput={handleSemesterInput}
                            semesters={props.semesters}
                            currentForm={currentForm}
                            setForm={setForm}
                            submissionAllowed={submissionAllowed}
                        />);
                })}
                <button
                    data-testid="add-year-button"
                    onClick={() => {
                        years.push(uuid(), years.value.length+1);
                    }}
                >
                        +
                </button>
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>Degree Requirements</th>
                        <th>Unmet Requirements</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>School of Engineering</td>
                        <td>{unmetRequirements.join(", ")}</td>
                    </tr>
                </tbody>
            </Table>
            <ErrorStack problems={problems.value} />
        </>
    );
}
