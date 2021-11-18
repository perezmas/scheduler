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
export function Plan(): JSX.Element {
    
    const [plans, setPlans] = useState<Array<PlanProps>>([]);
    const addPlan = () => {
        // sets array of all cards
        setPlans([...plans, {
            id: plans.length,
            uuid: uuid(),
            name: "",
            date: new Date().toLocaleDateString(),
            years: new Array<YearProps>()
        }]);
    };

    const deleteCard = (planItem: PlanProps) => {
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
    };
    
    const renderCard = (planItem: PlanProps) => {
        localStorage.setItem("Plans Array", JSON.stringify(plans));
        return (
            <Card data-testid={`Plan ${planItem.id}`} style={{ width: "18rem" }} className="grid">
                <Card.Body>
                    <Card.Title>Plan #{planItem.id} </Card.Title>
                    
                    <Link to={`Plans/${planItem.uuid}`}>
                        <button data-testid="edit-plan">
                            Edit Plan
                        </button>
                    </Link>
                    <Card.Text>{planItem.date}</Card.Text>
                    <button data-testid="delete-plan" onClick={() => {
                        deleteCard(planItem);
                    }}>-</button>
                    <button data-testid="copy-plan" onClick={() => {
                        copy(planItem);
                    }}>Duplicate Plan</button>
                </Card.Body>
            </Card>
        );
    };
    return (
        <div className="grid">    
            <button onClick={addPlan} data-testid="add-plan">Add a plan +</button>
            {plans.map(planItem =>
                <li key={planItem.uuid}>{renderCard(planItem)}</li>
            )}
        </div>
    );
}

export default Plan;