import React from "react";
import CourseProps from "../interfaces/Course";

const Course = (props: CourseProps): JSX.Element => {
    return <div> {props.name}</div>;
};

export default Course;
//export default CourseProps;