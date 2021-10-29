import React from "react";
import CourseProps from "../interfaces/Course";

interface CurrentCourseProps extends CourseProps {
    onRemoveCourse: (courseToRemove: CourseProps) => void;
    onClickEdit: (courseToEdit: CourseProps) => void;
}

const Course = (props: CurrentCourseProps): JSX.Element => {
    return (
        <>
            <div
                onClick={() => {
                    console.log(props.id);
                    props.onRemoveCourse(props);
                }}
            >
                {props.name}
            </div>
            <div>
                <button
                    className="trigger"
                    onClick={() => {
                        props.onClickEdit(props);
                    }}
                >
                    O
                </button>
            </div>
        </>
    );
};

export default Course;
