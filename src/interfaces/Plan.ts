import AbstractData from "./Data";
import YearData from "./Year";

interface PlanData extends AbstractData {
    /* The id of the plan */
    id: number
    /**The display name of the plan. */
    name?: string
    /**The date the plan was created. */
    date?: string
    /**All of the years in the plan. */
    years?: Array<YearData>
}

export default PlanData;