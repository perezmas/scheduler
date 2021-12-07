import AbstractData from "./Data";

/**Represents a semester internally; you will need to add a few more props to actually create a Semester (see FullSemesterProps in Semester.tsx). */
interface SemesterData extends AbstractData {
    /**The name of the semester. */
    name: string;
    /**The starting date of the semester. */
    start: Date;
    /**The end date of the semester. */
    end: Date;
}

export default SemesterData;