import AbstractProps from "./Props";
import { YearProps } from "./Year";

interface PlanProps extends AbstractProps {
    /* The id of the plan */
    id: number
    /**The display name of the plan. */
    name?: string
    /**The date the plan was created. */
    date?: string
    /**All of the years in the plan. */
    years?: Array<YearProps>
}

export default PlanProps;