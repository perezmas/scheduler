import React, { useState } from "react";
import { /*Row, Col, CardGroup, Button,*/ Card } from "react-bootstrap";
import "./styles.css";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import PlanProps from "../interfaces/Plan";
//import useLocalStorage from "../hooks/useLocalStorage";
//import { Scheduler } from "./Scheduler";

/*
export const planList: PlanProps[] = [
    {
        uuid: "1",
        name: "max",
        date: "01/01/2021"
    },
    {
        uuid: "2",
        name: "amani",
        date: "02/02/2021"
    },
    {
        uuid: "3",
        name: "lucas",
        date: "03/03/2021"
    },
    {
        uuid: "4",
        name: "bert",
        date: "04/04/2021"
    }
];*/

export function Plan(props: PlanProps): JSX.Element {

    //const [cards, setCards] = useState([]);
    const planList: typeof props[] = [];

    const [plans, setPlans] = useState(planList);
    /*
    if (props.name === undefined && props.uuid === undefined && props.date === undefined) {
        const [planName, setPlanName] = useLocalStorage("Plan Name", "");
        setPlans([...plans, {
            id: plans.length,
            uuid: uuid(),
            name: "New Plan",
            date: new Date().toLocaleDateString()
        }]);
    }*/
    
    const addPlan = () => {
        setPlans([...plans, {
            id: plans.length,
            uuid: uuid(),
            name: "New Plan",
            date: new Date().toLocaleDateString(),
            schedule: []
        }]);
    };

    const deleteCard = (oldArray: typeof planList , planItem: PlanProps) => {
        if (window.confirm("Are you sure you want to delete this plan?")) {
            
            const newArray = [...plans];
            console.log("plans array", plans);
            console.log(planItem.id);
            const index = planItem.id;
            
            //const index = newArray.findIndex((element: any) => element === planItem);
            console.log("index is", index);
            
            if (index !== -1 ){
                newArray.splice(index, 1);
                console.log("plan deleted");
                console.log("new array is", newArray);
                setPlans(newArray);
            }
            
            //plans.filter((i: any) => i.id !== index );
            //console.log("new array is", plans);
            
        }
    };

    const renderCard = (planItem: PlanProps) => {
        return (
            <Card style={{ width: "18rem" }} className="box">
                <Card.Body>
                    <Card.Title>{planItem.name}</Card.Title>
                    <Card.Title>{planItem.uuid}</Card.Title>
                    <Link to={`Plans/${planItem.uuid}`}>
                        <button>
                            Edit Plan
                        </button>
                    </Link>;
                    <Card.Text>{planItem.date}</Card.Text>
                    <button onClick={() => {
                        console.log("button pressed");
                        deleteCard(planList, planItem);
                    }}>-</button>
                </Card.Body>
            </Card>
        );
    };
    //classes = useStyles();
    //const dispatch = useDispatch();
    return (
        <div className="grid">
            <button onClick={addPlan}>Add a plan +</button>
            {plans.map(planItem => 
                <li key={planItem.uuid}>{renderCard(planItem)}</li>
            )}
        </div>
    );
}
/*
<Row><Col xs={5} className="g-4"><Card className="card">
    <Card.Img variant="top" src="./Plans/placeholder-image.jpeg"/>
    <Card.Body>
        <Card.Title className="title">
            <input type="Enter name for plan: " name="Plan 1" />
        </Card.Title>
        <Card.Text>This is a test card</Card.Text></Card.Body><Link to="/Plan">
        <Button variant="primary" >
                Go to plan</Button></Link><Card.Footer><small className="text-muted">Last updated x mins ago.</small></Card.Footer></Card></Col>
<Col xs={5} className="g-4"><Card className="card">
    <Card.Img variant="top" src="placeholder-image.jpeg"/>
    <Card.Body>
        <Card.Title className="title">Test Plan</Card.Title>
        <Card.Text>This is a test card</Card.Text></Card.Body><Link to="/Plan">
        <Button variant="primary" >
                Go to plan</Button></Link><Card.Footer><small className="text-muted">Last updated x mins ago.</small></Card.Footer></Card></Col></Row>*/
export default Plan;