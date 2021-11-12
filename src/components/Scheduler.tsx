import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useYears, { getByUUID } from "../hooks/useYears";
import { v4 as uuid } from "uuid";
import { YearProps } from "../interfaces/Year";

import Year from "./Year";
import useProblems, { Problem } from "../hooks/useProblems";
import ErrorStack from "./ErrorStack";
import validate from "../util/validation/dates";

import useCourses, { Courses } from "../hooks/useCourses";

import { Table } from "react-bootstrap";

interface SchedulerProps {
    /**csv data that can be used to reconstruct a scheduler. */
    csv?: string;
    /**Json data that can be used to reconstruct a scheduler.  */
    json?: string;
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

function clearCourses(semesterUuid: string, courses: Courses){
    const entries = courses.courseList.entries();
    for (
        let entry = entries.next();
        !entry.done;
        entry = entries.next()
    ) {
        if (entry.value[1].semester === semesterUuid) {
            courses.removeCourse(entry.value[0]);
        }
    }
}

export function Scheduler(props: SchedulerProps): JSX.Element {
    if (props.csv === undefined && props.json === undefined) {
        const years = useYears(getStartingYears);

        const courses = useCourses(undefined);

        const [unmetRequirements, setUnmetRequirements] = useState<
            Array<string>
        >([]);
        const [newName, setNewName] = useState<string | null>(null);
        const [newStart, setNewStart] = useState<string | null>(null);
        const [newEnd, setNewEnd] = useState<string | null>(null);
        const [currentForm, setCurrentForm] = useState<string | null>(null);
        const [submissionAllowed, setSubmissionAllowed] = useState(false);
        const problems = useProblems();
        const semesterFormInit = (uuid: string | null) => {
            setCurrentForm(uuid);
            setSubmissionAllowed(false);
            setNewName(null);
            setNewStart(null);
            setNewEnd(null);
            problems.clear("semester-form");
        };
        const handleSemesterInput = (event: ChangeEvent<HTMLInputElement>) => {
            switch (event.target.name) {
            case "season": {
                setNewName(event.target.value);
                break;
            }
            case "starts": {
                const semesters =
                        years.value[
                            getByUUID(years.value, currentForm as string)
                        ].semesters;
                const newDate = new Date(event.target.value);
                const newProblems = validate(
                    newDate,
                    newEnd !== null ? new Date(newEnd) : null,
                    semesters,
                    "starts"
                );
                if (newEnd === null) {
                    problems.clear("semester-form");
                    if (newProblems.length === 1) {
                        problems.add(newProblems[0]);
                    }
                } else {
                    problems.clear("semester-form");
                    for (const problem of newProblems) {
                        problems.add(problem);
                    }
                }
                setNewStart(event.target.value);
                break;
            }
            case "ends": {
                const semesters =
                        years.value[
                            getByUUID(years.value, currentForm as string)
                        ].semesters;
                const newDate = new Date(event.target.value);
                const newProblems = validate(
                    newStart !== null ? new Date(newStart) : null,
                    newDate,
                    semesters,
                    "ends"
                );
                if (newEnd === null) {
                    problems.clear("semester-form");
                    if (newProblems.length === 1) {
                        problems.add(newProblems[0]);
                    }
                } else {
                    problems.clear("semester-form");
                    for (const problem of newProblems) {
                        problems.add(problem);
                    }
                }
                setNewEnd(event.target.value);
                break;
            }
            }
        };

        //set if courses match requirements using props.requirements
        useEffect(() => {
            const requirements = props.requirements;
            const newCourses = Array<string>();

            for (const requirement of requirements) {
                if (!courses.courseList.has(requirement)) {
                    newCourses.push(requirement);
                }
            }
            setUnmetRequirements(newCourses);
        }, [props.requirements, courses.courseList]);

        const handleSemesterSubmit = (
            event: FormEvent<HTMLFormElement>,
            id: string
        ) => {
            event.preventDefault();
            if (newName !== null && newEnd !== null && newStart !== null) {
                years.putSemester(
                    id,
                    uuid(),
                    new Date(newStart as string),
                    new Date(newEnd as string),
                    newName as string
                );
                setNewName(null);
                setNewStart(null);
                setNewEnd(null);
                setCurrentForm(null);
                problems.clear("semester-form");
            }
        };
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
                    {years.value.map((props: YearProps, i: number) => {
                        return (
                            <div data-testid={"Year"} key={props.uuid}>
                                <Year
                                    courses={courses}
                                    canSubmit={submissionAllowed}
                                    handleInput={handleSemesterInput}
                                    handleSubmit={(
                                        event: FormEvent<HTMLFormElement>
                                    ) => {
                                        handleSemesterSubmit(event, props.uuid);
                                    }}
                                    semesters={props.semesters}
                                    uuid={props.uuid}
                                    index={i + 1}
                                    formUuid={currentForm}
                                    removeSemester={(semesterUuid: string) => {
                                        years.removeSemester(
                                            props.uuid,
                                            semesterUuid
                                        );
                                    }}
                                    clear={() => {
                                        years.clear(props.uuid);
                                    }}
                                    clearCourses={(semesterUuid: string) => {
                                        clearCourses(semesterUuid, courses);
                                    }}
                                    formInit={semesterFormInit}
                                />
                            </div>
                        );
                    })}
                    <button
                        data-testid="add-year-button"
                        onClick={() => {
                            years.push(uuid(), years.value.length);
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
    return <></>;
}
