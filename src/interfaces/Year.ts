import AbstractProps from "./Props";
import SemesterProps from "./Semester";

export interface YearProps extends AbstractProps {
    index: number;
    semesters: Array<SemesterProps>;
    /**How many credits the course is worth */
    // credits: number;
}
