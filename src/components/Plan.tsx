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
    
    //plans.forEach(val => planList.push(Object.assign({}, val)));
    
    //const stringLoad = String(localStorage.getItem("Plans Array"));
    //const testArray: PlanProps[] = JSON.parse(stringLoad);
    //console.log("loaded vals" , testArray);
    

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

        // if first item in array, set value of index 0
        if (index === 1){
            arr.push(plans[0]);
        }
        // temp array that saves the plan info to new key and values in localStorage
        if (index > 1){
            arr.push(plans[index-1]);
            //localStorage.setItem(`plan:${index-1}`, JSON.stringify(arr));
        }
        //arr.push({id: plans.length, uuid: uuid(), name: "", date: new Date().toLocaleDateString(), years: Array<YearProps>()});
    };

    const deleteCard = (oldArray: typeof plans, planItem: PlanProps) => {
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

    
    //const testArray: PlanProps[] = [];
    
    const renderCard = (planItem: PlanProps) => {
        /*const onChange = (event: ChangeEvent<HTMLInputElement>) => {
            setNewName(event.currentTarget.value);
        };*/
        //const planName = planItem.name;
        //const index = plans.length;
        //planItem.id = plans.length;
        
        //const set = JSON.stringify(localStorage.getItem("test"));
        //console.log(JSON.parse(set));
        //console.log("PLANS IS " , plans);
        
        //console.log("PLANS IS " , plans);
        localStorage.setItem("Plans Array", JSON.stringify(plans));
        //const stringLoad = String(localStorage.getItem("Plans Array"));
        //const testArray: PlanProps[] = JSON.parse(stringLoad);
        //console.log("loaded vals" , testArray[testArray.length-1]);
        return (
            <Card style={{ width: "18rem" }} className="grid">
                <Card.Body>
                    <Card.Title>Plan #{planItem.id} </Card.Title>
                    
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


    //const arrBackup: PlanProps[] = [];
    /*
    const stringLoad = String(localStorage.getItem("Plans Array"));
    console.log("LOADED IN: ", stringLoad);
    const testArray: PlanProps[] = JSON.parse(stringLoad);
    console.log("loaded vals" , testArray);
    //localStorage.setItem("Plans Array", JSON.stringify(plans));
    if (plans.length === 1){
        localStorage.setItem(`plan: ${0}`, JSON.stringify(plans[0]));
    }

    // temp array that saves the plan info to new key and values in localStorage
    if (plans.length > 1){
        localStorage.setItem(`plan: ${plans.length-1}`, JSON.stringify(plans[plans.length-1]));
    }
    /*
    const save = (plans: PlanProps[]) => {
        //console.log("this is plans", plans);
        
        plans.forEach(val => arrBackup.push(Object.assign({}, val)));
        //const arr = plans;
        
        //localStorage.setItem("arr", JSON.stringify(arr));
        
        localStorage.setItem("Plans Array", JSON.stringify(plans));
        if (plans.length === 1){
            localStorage.setItem(`plan: ${0}`, JSON.stringify(plans[0]));
        }

        // temp array that saves the plan info to new key and values in localStorage
        if (plans.length > 1){
            localStorage.setItem(`plan: ${plans.length-1}`, JSON.stringify(plans[plans.length-1]));
        }
        
    };*/
    
    /*
    const load = (planItem: PlanProps) => {
        const index = planItem.id;
        localStorage.getItem(`plan:${planItem.id}`);
        const map = plans.map(planItem =>
            <li key={planItem.uuid}>{renderCard(planItem)}</li>
        );
        console.log("map is: ", map);
        return map;
    };*/
    //const [saveTest, useSaveTest] = useState(localStorage.setItem());
    
        
    //renderCard(planItem);
    /*
    const test = JSON.stringify(localStorage.getItem("Plans Array"));
    console.log("test:  ", test);
    const test2: PlanProps = JSON.parse(test);
    console.log("test2: ", test2);
    */
   
   
    //localStorage.getItem("SAVED ARRAY");
    
    //classes = useStyles();
    //const dispatch = useDispatch();
    /*
    const renderItems = (testArray: PlanProps[]) =>{
        if(testArray){
            return (
                <div className="grid">
                    <button onClick={addPlan}>Add a plan +</button>
                    {JSON.parse(JSON.stringify(localStorage.getItem("Plans Array")))}
                    {testArray.map(planItem =>
                        <li key={planItem.uuid}>{renderCard(planItem)}</li>
                    )}    
                    
                </div>
            ); 
        }
    };
    */
    

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