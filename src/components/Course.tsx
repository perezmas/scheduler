import CourseProps from "../interfaces/Course";

const Course = (props: CourseProps) => {
    return <div> {props.name}</div>;
};

export default Course;
