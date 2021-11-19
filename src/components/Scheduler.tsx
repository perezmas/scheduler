import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useYears, { getByUUID } from "../hooks/useYears";
import { v4 as uuid } from "uuid";
import { YearProps } from "../interfaces/Year";
import useProblems, { Problem } from "../hooks/useProblems";
import ErrorStack from "./ErrorStack";
import useCourses from "../hooks/useCourses";
import { Table, Button, Dropdown, ButtonGroup } from "react-bootstrap";
import {
    handleSemesterFormInput,
    handleSemesterFormSubmit,
} from "../util/events/SemesterFormEvents";
import Year from "./Year/Year";
import { Link } from "react-router-dom";

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

export function Scheduler(props: SchedulerProps): JSX.Element {
    if (props.csv === undefined && props.json === undefined) {
        const years = useYears(getStartingYears);

        const courses = useCourses();
        //The requirements for the degree that are not present in the plan
        const [unmetRequirements, setUnmetRequirements] = useState<
            Array<string>
        >([]);
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
            handleSemesterFormInput(
                event,
                newStart,
                newEnd,
                setNewName,
                setNewStart,
                setNewEnd,
                years,
                currentForm,
                problems
            );
        };

        const handleSemesterSubmit = (
            event: FormEvent<HTMLFormElement>,
            id: string
        ) => {
            handleSemesterFormSubmit(
                event,
                id,
                newName,
                newStart,
                newEnd,
                () => {
                    setForm(null);
                },
                years.putSemester
            );
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
                <h1 className="center ">Course Schedule</h1>

                <div className="degree-requirements-wrapper">
                    <div className="degree-requirements">
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
                    </div>
                </div>
                <div>
                    {years.value.map((props: YearProps) => {
                        return (
                            <Year
                                key={props.uuid}
                                clearYear={() => {
                                    years.clearYears(props.uuid);
                                }}
                                removeYear={() => {
                                    years.removeYears(props.uuid);
                                }}
                                removeSemester={(semesterUuid: string) => {
                                    years.removeSemester(
                                        props.uuid,
                                        semesterUuid
                                    );
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
                            />
                        );
                    })}

                    <div className="center">
                        <Dropdown as={ButtonGroup}>
                            <Button
                                onClick={() => {
                                    years.push(uuid(), years.value.length + 1);
                                }}
                                data-testid="add-year-button"
                                variant="success"
                            >
                                Add Year +
                            </Button>

                            <Dropdown.Toggle
                                split
                                variant="success"
                                id="dropdown-split-basic"
                            />

                            <Dropdown.Menu>
                                <Dropdown.Item
                                    style={{ color: "#DC3E45" }}
                                    onClick={() => {
                                        years.clearYears();
                                    }}
                                    data-testid="clear-years-button"
                                >
                                    Clear Years
                                </Dropdown.Item>
                                <Dropdown.Item
                                    style={{ color: "#DC3E45" }}
                                    onClick={() => {
                                        years.removeYears();
                                    }}
                                    data-testid="remove-years-button"
                                >
                                    Remove All Years
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                <ErrorStack problems={problems.value} />
            </>
        );
    }
    return <></>;
}
