import AbstractProps from "./Props";
import SemesterProps from "./Semester";

export interface YearProps extends AbstractProps{
    index: number,
    semesters: Array<SemesterProps>
};