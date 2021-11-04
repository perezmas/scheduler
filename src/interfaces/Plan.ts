import AbstractProps from "./Props";

interface PlanProps extends AbstractProps {
    /* The name of the plan */
    id: number
    name: string
    date: string
    schedule: []
}

export default PlanProps;