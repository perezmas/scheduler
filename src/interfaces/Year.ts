import AbstractProps from "./Props";
import SemesterProps from "./Semester";

/**Represents a Year component internally. Actually rendering a Year takes more props; see FullYearProps in Year.tsx. */
export interface YearProps extends AbstractProps {
    /**The number of the year (e.g. freshman year is year 1, sophomore year is year 2, etc.) */
    index: number;
    /**All of the semesters in the year. */
    semesters: Array<SemesterProps>;
}
