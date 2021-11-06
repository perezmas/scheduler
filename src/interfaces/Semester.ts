import AbstractProps from "./Props";

interface SemesterProps extends AbstractProps {
    name: string;
    start: Date;
    end: Date;

    /**How many credits the course is worth */
    // credits: number;
}

export default SemesterProps;
