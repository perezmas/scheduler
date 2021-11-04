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
    case "REMOVE COURSE": {
        const newState = new Map<string, CourseProps>(state);
        newState.delete(action.payload.id);
        return newState;
    }
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

interface FullSemesterProps extends SemesterProps {
    removeSemester: () => void;
}
const Semester = (props: FullSemesterProps): JSX.Element => {
    const [newCourse, setNewCourse] = useState<CourseProps>({
        id: "",
        name: "",
        description: "",
        credits: 0,
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    console.log("Semester render!");
    const [courses, updateCourses] = useReducer(
        courseReducer,
        props.courses,
        courseInit
    );

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const courseToAdd: CourseProps = { ...newCourse };
        console.log(event.target.name);
        switch (event.target.name) {
        case "courseName":
            courseToAdd.name = event.target.value;

            break;
        case "courseID":
            courseToAdd.id = event.target.value;
            break;
        case "courseDescription":
            courseToAdd.description = event.target.value;
            break;
        case "courseCredits":
            courseToAdd.credits = parseInt(event.target.value);
            break;
        }
        setNewCourse(courseToAdd);
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
        setNewCourse(courseToEdit);
        setIsOpen(true);
        setIsEditing(true);
    };
    const handleCourseSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const action: CourseAction = {
            type: "ADD COURSE",
            payload: newCourse,
        };

        updateCourses(action);
        setNewCourse({
            id: "",
            name: "",
            description: "",
            credits: 0,
        });
        if (isEditing) setIsEditing(false);
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
                defaultValues={newCourse}
                isEditing={isEditing}
                isOpen={isOpen}
                onClickClose={() => {
                    setIsOpen(false);
                    setIsEditing(false);
                }}
                onClickSubmit={(event: FormEvent<HTMLFormElement>) => {
                    handleCourseSubmit(event);
                }}
                onChange={handleOnChange}
            ></AddCourse>

            <span
                data-testid={`Semester ${
                    props.name
                } ${props.start.getUTCFullYear()}`}
            >
                {props.name}
            </span>
            <button
                data-testid={`Remove Semester ${
                    props.name
                } ${props.start.getUTCFullYear()}`}
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
