import React from "react";
import CourseProps from "../interfaces/Course";

interface CurrentCourseProps extends CourseProps {
    /**A function that deletes this course from the global map containing all courses. */
    removeCourse: (uuid: string) => void;
    /**A function that is called when the user clicks the edit button to edit this course. */
    onClickEdit: (uuid: string) => void;
}

/**A component that represents a course. */
const Course = (props: CurrentCourseProps): JSX.Element => {
    return (
        <div draggable={true}>
            <div
                style={{ display: "inline-block" }}
                onClick={() => {
                    props.removeCourse(props.uuid);
                }}
            >
                {`${props.credits} ${props.name}`}
            </div>
            <button
                style={{ display: "inline-block" }}
                className="trigger"
                data-testid="edit-course-button"
                onClick={() => {
                    props.onClickEdit(props.uuid);
                }}
            >
                Edit
            </button>
        </div>
    );
};

export default Course;
