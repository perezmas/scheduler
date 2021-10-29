import React, { FormEvent, useReducer, useState } from "react";
import CourseProps from "../interfaces/Course";

import SemesterProps from "../interfaces/Semester";
import AddCourse from "./AddCourse";
import Course from "./Course";

interface CourseAction {
    type: "ADD COURSE" | "REMOVE COURSE";
    payload: CourseProps;
}

// easy access to the courses

const courseReducer = (
    state: Map<string, CourseProps>,
    action: CourseAction
): Map<string, CourseProps> => {
    switch (action.type) {
    case "ADD COURSE":
        return state.set(action.payload.id, action.payload);
    case "REMOVE COURSE":
        state.delete(action.payload.id);
        return state;
    }
};

// const onRightClickCourse = (event: React.MouseEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     console.log("Right Clicked");
// };

const courseInit = (
    courses: Map<string, CourseProps>
): Map<string, CourseProps> => {
    if (courses) return courses;
    else return new Map<string, CourseProps>();
};
const Semester = (props: SemesterProps): JSX.Element => {
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
    const onRemoveCourse = (courseToRemove: CourseProps) => {
        const action: CourseAction = {
            type: "REMOVE COURSE",
            payload: courseToRemove,
        };
        updateCourses(action);
        console.log("Remove Course", courseToRemove.id);
    };

    const onClickEdit = (courseToEdit: CourseProps) => {
        setNewCourseName(courseToEdit.name);
        setNewCourseDescription(courseToEdit.description);
        setNewCourseID(courseToEdit.id);
        setIsOpen(true);
    };
    const handleCourseSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newCourse: CourseProps = {
            id: newCourseID,
            name: newCourseName,
            description: newCourseDescription,
        };

        const action: CourseAction = {
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
                    <Course
                        onClickEdit={onClickEdit}
                        onRemoveCourse={onRemoveCourse}
                        {...course}
                    />{" "}
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

            {props.name}
            <button
                className="trigger"
                onClick={() => {
                    setIsOpen(true);
                }}
                data-testid="add-course-button"
            >
                +
            </button>
            <button
                className="trigger"
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                -
            </button>
            <div className="courses">{addedCourses}</div>
        </>
    );
};

export default Semester;
