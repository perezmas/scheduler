import CourseProps from "./Course";

interface SemesterProps{
    uuid: string,
    name: string,
    start: Date,
    end: Date,
    courses: Map<string,CourseProps>
};

export default SemesterProps;