import React from "react";
import CourseProps from "../interfaces/Course";
import {useDrag} from "react-dnd";

export interface FullCourseProps extends CourseProps {
    /**A function that deletes this course from the global map containing all courses. */
    removeCourse: (uuid: string) => void;
    /**A function that is called when the user clicks the edit button to edit this course. */
    onClickEdit: (uuid: string) => void;
}

/**A component that represents a course. */
const Course = (props: FullCourseProps): JSX.Element => {
    const [,drag] = useDrag(() => ({
        type: "COURSE",
        item: {
            uuid: props.uuid
        }
    }),[props.uuid]);
    return (
        <div ref={drag} draggable={true} data-testid={`Course ${props.id}: ${props.name}`}>
            <div style={{ display: "inline-block" }}>
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
            <button
                style={{ display: "inline-block", color: "#DC3E45" }}
                className="trigger"
                data-testid="remove-course"
                onClick={() => {
                    props.removeCourse(props.uuid);
                }}
            >
                Remove
            </button>
        </div>
    );
};

export default Course;
