import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useYears, { getByUUID } from "../hooks/useYears";
import { v4 as uuid } from "uuid";
import YearData from "../interfaces/Year";
import useProblems, { Problem } from "../hooks/useProblems";
import ErrorStack from "./ErrorStack";
import useCourses from "../hooks/useCourses";
import { Button, Dropdown, ButtonGroup } from "react-bootstrap";
import {
    handleSemesterFormInput,
    handleSemesterFormSubmit,
} from "../util/events/SemesterFormEvents";
import Year from "./Year/Year";
import { Plans } from "../hooks/usePlans";
import CourseData from "../interfaces/Course";
import MetRequirementsTable from "./MetRequirementsTable";
import ExportCSV from "./ExportCSV";

export interface SchedulerProps {
    /**All the course ID's for the requirements for the degree this scheduler is designed to help acquire. */
    requirements: Array<string>;
    plans: Plans;
    scheduleId: string;    
}


function getStartingYears(): Array<YearData> {
    const year = new Date().getFullYear();

    const output = new Array<YearData>();
    const yearOne: YearData = { index: 1, uuid: uuid(), semesters: [] };
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
    const yearTwo: YearData = { index: 2, uuid: uuid(), semesters: [] };
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

export function Scheduler(scheduleProps: SchedulerProps): JSX.Element {
    let years = useYears(getStartingYears);

    let getCurrentYears: () => Array<YearData> = getStartingYears;
    let currentCourses: Array<CourseData> | undefined = undefined;

    const planId = getByUUID(scheduleProps.plans.planList, scheduleProps.scheduleId);
    // initialize years and courses
    if (planId !== -1){

        const plan = scheduleProps.plans.planList[planId];
        if ( plan.years !== undefined && plan.years.length > 0){
            getCurrentYears = () => {
                if (plan.years){
                    return plan.years;
                }else{
                    return new Array<YearData>();
                }
            };
            
        }
        if (plan.courses !== undefined && plan.courses.length > 0){
            if (plan.courses){
                currentCourses = plan.courses;
            }
        }
    }
    years = useYears(getCurrentYears);

    const courses = useCourses(currentCourses);
    //The requirements for the degree that are not present in the plan
    const [unmetRequirements, setUnmetRequirements] = useState<Array<string>>(
        []
    );
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
    const getByCourseID = (
        courseList: CourseData[],
        courseID: string
    ): number => {
        for (let i = 0; i < courseList.length; i++) {
            if (courseList[i].id === courseID) {
                return i;
            }
        }
        return -1;
    };

    //set if courses match requirements using props.requirements
    useEffect(() => {
        const requirements = scheduleProps.requirements;
        const newCourses = Array<string>();

        for (const requirement of requirements) {
            if (getByCourseID(courses.courseList, requirement) === -1) {
                newCourses.push(requirement);
            }
        }

        setUnmetRequirements(newCourses);
    }, [scheduleProps.requirements, courses.courseList]);



    useEffect(() => {
        scheduleProps.plans.setYears(scheduleProps.scheduleId, years.value);
        scheduleProps.plans.setCourses(scheduleProps.scheduleId, courses.courseList);
    }, [years.value, courses.courseList]);

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
            <ExportCSV courses={courses} years={years}></ExportCSV>
            <MetRequirementsTable
                requirements={scheduleProps.requirements}
                unmetRequirements={unmetRequirements}
            />
            <div>
                {years.value.map((props: YearData) => {
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
                                years.removeSemester(props.uuid, semesterUuid);
                            }}
                            courses={courses.courseList}
                            addCourse={courses.push}
                            moveCourse={courses.move}
                            removeCourse={courses.removeCourse}
                            index={props.index}
                            uuid={props.uuid}
                            handleSemesterSubmit={handleSemesterSubmit}
                            handleSemesterInput={handleSemesterInput}
                            semesters={props.semesters}
                            currentForm={currentForm}
                            setForm={setForm}
                            submissionAllowed={submissionAllowed}
                            requirements={unmetRequirements}
                        />
                    );
                })}

                <div className="center">
                    <Dropdown id="add-year-dropdown" as={ButtonGroup}>
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
                            data-testid="clear-remove-years-toggle"
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
