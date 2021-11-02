import CourseProps from "./Course";
import AbstractProps from "./Props";

interface SemesterProps extends AbstractProps {
    name: string;
    start: Date;
    end: Date;
    courses: Map<string, CourseProps>;
    /**How many credits the course is worth */
    // credits: number;
}

export default SemesterProps;
