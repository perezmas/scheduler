import CourseProps from "./Course";
import AbstractProps from "./Props";

interface SemesterProps extends AbstractProps{
    name: string,
    start: Date,
    end: Date,
    courses: Map<string,CourseProps>
};

export default SemesterProps;