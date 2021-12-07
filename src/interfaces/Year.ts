import AbstractData from "./Data";
import SemesterData from "./Semester";

/**Represents a Year component internally. Actually rendering a Year takes more props; see FullYearProps in Year.tsx. */
interface YearData extends AbstractData {
    /**The number of the year (e.g. freshman year is year 1, sophomore year is year 2, etc.) */
    index: number;
    /**All of the semesters in the year. */
    semesters: Array<SemesterData>;
}
export default YearData;