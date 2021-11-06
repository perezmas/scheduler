import React, { FormEvent, useEffect, useReducer, useState } from "react";
import { CourseAction } from "../hooks/useCourses";
import CourseProps from "../interfaces/Course";

import SemesterProps from "../interfaces/Semester";
import AddCourse from "./AddCourse";
import Course from "./Course";

interface FullSemesterProps extends SemesterProps {
    coursesForThisSemester: CourseProps[];
    courses: Map<string, CourseProps>;
    removeSemester: () => void;
    updateCourses: (action: CourseAction) => void;
}
const Semester = (props: FullSemesterProps): JSX.Element => {
    const [coursesForThisSemester, setCoursesForThisSemester] = useState<
        CourseProps[]
    >(new Array<CourseProps>());

    useEffect(() => {
        setCoursesForThisSemester(props.coursesForThisSemester);
    }, [props.coursesForThisSemester]);

    const [newCourse, setNewCourse] = useState<CourseProps>({
        id: "",
        name: "",
        description: "",
        credits: 0,
        semester: props.uuid,
        coreqs: [],
        prereqs: [],
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    console.log("Semester render!");

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
    const unAttachCourse = (courseToRemove: CourseProps) => {
        const action: CourseAction = {
            type: "REMOVE COURSE",
            payload: courseToRemove,
        };
        props.updateCourses(action);
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

        props.updateCourses(action);
        setNewCourse({
            id: "",
            name: "",
            description: "",
            credits: 0,
            semester: props.uuid,
            coreqs: [],
            prereqs: [],
        });
        if (isEditing) setIsEditing(false);
    };
    const addedCourses = coursesForThisSemester.map((course) => {
        return (
            <div key={course.id}>
                {
                    <Course
                        {...course}
                        onClickEdit={onClickEdit}
                        onRemoveCourse={unAttachCourse}
                    />
                }
            </div>
        );
    });

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
