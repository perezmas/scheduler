import React, { useState } from "react";
import { /*Row, Col, CardGroup, Button,*/ Card } from "react-bootstrap";
import "./styles.css";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import PlanProps from "../interfaces/Plan";
import { YearProps } from "../interfaces/Year";
//import { useLocalStorage } from "../hooks/useLocalStorage";
//import useLocalStorage from "../hooks/useLocalStorage";
//import { Scheduler } from "./Scheduler";
//import useLocalStorage from "../hooks/useLocalStorage";
//import { Scheduler } from "./Scheduler";

/*
export const testList: PlanProps[] = [
    {
        uuid: "1",
        name: "max",
        date: "01/01/2021"
    },
    {
        uuid: "2",
        name: "amani",
        date: "02/02/2021"
    }
];*/

export function Plan(props: PlanProps): JSX.Element {

    //const [cards, setCards] = useState([]);
    const planList: typeof props[] = [];
    
    const [plans, setPlans] = useState(planList);
    /*
    const [newId, setNewId] = useState<number | null>(null);
    const [newName, setNewName] = useState<string | null>(null);
    const [newDate, setNewDate] = useState<string | null>(null);
    const [currentYears, setCurrentYears] = useState<Array<YearProps> | null>(null);
    */
    //const arr: typeof props[] = [];
    //const [newName, setNewName] = useState<props.name>(null);

    // if array is empty, initialize basic values
    /*
    if (props.id === undefined && props.name === undefined && props.date === undefined && props.years === undefined ) {
        const [newId, setNewId] = useState<number | null>(null);
        const [newName, setNewName] = useState<string | null>(null);
        const [newDate, setNewDate] = useState<string | null>(null);
        const [currentYears, setCurrentYears] = useState<Array<YearProps> | null>(null);
        /*
        setPlans([...plans, {
            id: plans.length,
            uuid: uuid(),
            name: "Enter Plan Name",
            date: new Date().toLocaleDateString(),
            years: []
        }]);
    }*/
    /*
    const modal = () => {
        <form>
            ENTER PLAN NAME:
            <input type="text" onChange={(e) => e.target.value} />
        </form>;

    };*/
    
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
            //localStorage.setItem(`plan:${0}`, JSON.stringify(arr));
        }

        // temp array that saves the plan info to new key and values in localStorage
        if (index > 0){
            arr.push(plans[index-1]);
            //localStorage.setItem(`plan:${index-1}`, JSON.stringify(arr));
            console.log("array: ", arr);
        }
        //arr.push({id: plans.length, uuid: uuid(), name: "", date: new Date().toLocaleDateString(), years: Array<YearProps>()});
    };
    //localStorage.setItem(`plan:${plans.length}`, JSON.stringify(plans[plans.length-1]));
    //console.log(JSON.stringify(plans));
    //localStorage.setItem(`plan:${0}`, JSON.stringify(plans));
    /*const findIndex = (item: PlanProps) => {
        return (item.uuid === props.uuid);
    };*/
    //localStorage.setItem(`plan:${plans.length}`, JSON.stringify(plans));
    //useLocalStorage(`plan:${props.uuid}`, JSON.stringify(plans));
    //const json = "{"id": "string", "uuid": "string", "name": "string", "date": "string", "years":}";
    //const pla: PlanProps = JSON.parse(json);
    //console.log(pla);

    const deleteCard = (oldArray: typeof planList, planItem: PlanProps) => {
        if (window.confirm("Are you sure you want to delete this plan?")) {

            const newArray = [...plans];
            console.log("plans array", plans);
            console.log(planItem.id);
            const index = newArray.indexOf(planItem);

            //const index = newArray.findIndex((element: any) => element === planItem);
            console.log("index is", index);

            if (index !== -1) {
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
        /*const onChange = (event: ChangeEvent<HTMLInputElement>) => {
            setNewName(event.currentTarget.value);
        };*/
        //const planName = planItem.name;
        //const index = plans.length;
        
        return (
            <Card style={{ width: "18rem" }} className="box">
                <Card.Body>
                    <Card.Title>Plan #{(planItem.id+1)} </Card.Title>
                    <Card.Text>{planItem.uuid}</Card.Text>
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
                </Card.Body>
            </Card>
        );
    };

    const save = (plans: PlanProps[]) => {
        if (plans.length <= 0){
            localStorage.setItem(`plan: ${0}`, JSON.stringify(plans[plans.length]));
        }

        // temp array that saves the plan info to new key and values in localStorage
        if (plans.length > 0){
            localStorage.setItem(`plan: ${plans.length-1}`, JSON.stringify(plans[plans.length-1]));
        }
    };

    const load = (planItem: PlanProps, plans: PlanProps[]) => {
        localStorage.getItem(`plan:${planItem.id}`);
        renderCard(planItem);
    };
    
    //classes = useStyles();
    //const dispatch = useDispatch();
    return (
        <div className="grid">
            <button onClick={addPlan}>Add a plan +</button>
            {localStorage.setItem("Plans Array", JSON.stringify(plans))}
            {save(plans)}
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