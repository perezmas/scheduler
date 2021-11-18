import React, { useState } from "react";
import { Card } from "react-bootstrap";
import "./styles.css";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import PlanProps from "../interfaces/Plan";
import { YearProps } from "../interfaces/Year";


export const testList: PlanProps[] = [
    {
        uuid: "1",
        id: 1,
        name: "max",
        date: "01/01/2021",
        years: Array<YearProps>()
    },
    {
        uuid: "2",
        id: 2,
        name: "amani",
        date: "02/02/2021",
        years: Array<YearProps>()
    }
];

/**A card on the home screen that lets the user move between schedulers, mainly so that advisors can keep track of their students. */
export function Plan(props: PlanProps): JSX.Element {
    
    const [plans, setPlans] = useState<Array<PlanProps>>([]);
    const addPlan = () => {
        // sets array of all cards
        setPlans([...plans, {
            id: plans.length,
            uuid: uuid(),
            name: "",
            date: new Date().toLocaleDateString(),
            years: Array<YearProps>()
        }]);
        const index = plans.length;
        console.log("index: ", index);
        const arr: typeof props[] = [];
        
        // if empty array of plans
        
        if (index <= 0){
            arr.push(plans[0]);
        }

        // if first item in array, set value of index 0
        if (index === 1){
            arr.push(plans[0]);
        }
        if (index > 1){
            arr.push(plans[index-1]);
        }
    };

    const deleteCard = (oldArray: typeof plans, planItem: PlanProps) => {
        if (window.confirm("Are you sure you want to delete this plan?")) {

            const newArray = [...plans];
            const index = newArray.indexOf(planItem);

            if (index !== -1) {
                newArray.splice(index, 1);
                setPlans(newArray);
            }
        }
    };

    const copy = (planItem: PlanProps) => {
        // sets array of all cards
        setPlans([...plans, {
            id: planItem.id,
            uuid: uuid(),
            name: planItem.name,
            date: planItem.date,
            years: planItem.years
        }]);
        const index = plans.length;
        console.log("index: ", index);
    };
    
    const renderCard = (planItem: PlanProps) => {
        localStorage.setItem("Plans Array", JSON.stringify(plans));
        return (
            <Card style={{ width: "18rem" }} className="grid">
                <Card.Body>
                    <Card.Title>Plan {planItem.id} </Card.Title>
                    
                    <Link to={`Plans/${planItem.uuid}`}>
                        <button>
                            Edit Plan
                        </button>
                    </Link>
                    <Card.Text>{planItem.date}</Card.Text>
                    <button onClick={() => {
                        console.log("button pressed");
                        deleteCard(plans, planItem);
                    }}>-</button>
                    <button onClick={() => {
                        copy(planItem);
                    }}>Duplicate Plan</button>
                </Card.Body>
            </Card>
        );
    };
    return (
        <div className="grid" style={{ marginLeft: "2%", marginRight: "auto" }}>    
            <button className="btn btn-primary" onClick={addPlan} style={{ backgroundColor: "#ff0044", color: "white", border: "none", fontSize: "20px", padding: "15px 32px", cursor: "pointer", borderRadius: "50px" }}>Add a plan +</button>
            {plans.map(planItem =>
                <li key={planItem.uuid}>{renderCard(planItem)}</li>
            )}
        </div>
    );
}

export default Plan;