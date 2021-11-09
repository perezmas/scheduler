import AbstractProps from "./Props";
import { YearProps } from "./Year";

interface PlanProps extends AbstractProps {
    /* The name of the plan */
    id: number
    name?: string
    date?: string
    years?: Array<YearProps>
}

export default PlanProps;