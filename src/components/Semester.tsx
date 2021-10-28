import React, { FormEvent, useReducer, useState } from "react";
import CourseProps from "../interfaces/Course";

import SemesterProps from "../interfaces/Semester";
import AddCourse from "./AddCourse";
import Course from "./Course";

interface AddCourseAction {
    type: "ADD COURSE";
    payload: CourseProps;
}
// easy access to the courses

const courseReducer = (
    state: Map<string, CourseProps>,
    action: AddCourseAction
): Map<string, CourseProps> => {
    switch (action.type) {
    case "ADD COURSE":
        return state.set(action.payload.id, action.payload);
    }
};

const courseInit = (
    courses: Map<string, CourseProps>
): Map<string, CourseProps> => {
    if (courses) return courses;
    else return new Map<string, CourseProps>();
};

interface FullSemesterProps extends SemesterProps{
    removeSemester: () => void;
}
const Semester = (props: FullSemesterProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [newCourseName, setNewCourseName] = useState<string>("");
    const [newCourseID, setNewCourseID] = useState<string>("");
    const [newCourseDescription, setNewCourseDescription] =
        useState<string>("");

    const [courses, updateCourses] = useReducer(
        courseReducer,
        props.courses,
        courseInit
    );

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        switch (event.target.name) {
        case "courseName":
            setNewCourseName(event.target.value);
            break;
        case "courseID":
            setNewCourseID(event.target.value);
            break;
        case "courseDescription":
            setNewCourseDescription(event.target.value);
            break;
        }
    };
    const handleCourseSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newCourse: CourseProps = {
            id: newCourseID,
            name: newCourseName,
            description: newCourseDescription,
        };

        const action: AddCourseAction = {
            type: "ADD COURSE",
            payload: newCourse,
        };

        updateCourses(action);
        setNewCourseName("");
        setNewCourseDescription("");
        setNewCourseID("");
    };
    const addedCourses = Array.from(courses).map(
        ([courseID, course]: [string, CourseProps]) => {
            return (
                <div key={courseID}>
                    <Course {...course} />{" "}
                </div>
            );
        }
    );

    return (
        <>
            <AddCourse
                defaultValues={{
                    courseName: newCourseName,
                    courseID: newCourseID,
                    courseDescription: newCourseDescription,
                }}
                isOpen={isOpen}
                onClickClose={() => setIsOpen(false)}
                onClickSubmit={(event: FormEvent<HTMLFormElement>) => {
                    handleCourseSubmit(event);
                }}
                onChange={handleOnChange}
            ></AddCourse>

            <span data-testid={`Semester ${props.name} ${props.start.getUTCFullYear()}`}>{props.name}</span>
            <button
                data-testid={`Remove Semester ${props.name} ${props.start.getUTCFullYear()}`}
                className="trigger"
                onClick={props.removeSemester}
            >
                -
            </button>

            <div className="courses">{addedCourses}</div>
            <button
                className="trigger"
                onClick={() => {
                    setIsOpen(true);
                }}
                data-testid="add-course-button"
            >
                +
            </button>
        </>
    );
};

export default Semester;
