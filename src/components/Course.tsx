import React from "react";
import CourseProps from "../interfaces/Course";

interface CurrentCourseProps extends CourseProps {
    onRemoveCourse: (courseToRemove: CourseProps) => void;
    onClickEdit: (courseToEdit: CourseProps) => void;
}

const Course = (props: CurrentCourseProps): JSX.Element => {
    return (
        <div draggable={true}>
            <div
                style={{ display: "inline-block" }}
                onClick={() => {
                    console.log(props.id);
                    props.onRemoveCourse(props);
                }}
            >
                {`${props.credits} ${props.name}`}
            </div>
            <button
                style={{ display: "inline-block" }}
                className="trigger"
                data-testid="edit-course-button"
                onClick={() => {
                    props.onClickEdit(props);
                }}
            >
                Edit
            </button>
        </div>
    );
};

export default Course;
