import React, {ChangeEvent, FormEvent, useState} from "react";
import useYears from "../hooks/useYears";
import {v4 as uuid} from "uuid";
import SemesterProps from "../interfaces/Semester";
import { YearProps } from "../interfaces/Year";
import Year from "./Year";
import useLocalStorage from "../hooks/useLocalStorage";
import PlanProps from "../interfaces/Plan";
interface SchedulerProps{
    csv?: string,
    json?: string
}


/*
export const plans: Props[] = [
    plan1: {

    }
]*/

/*
\
[  {"id":"1"}              ]

plans [

    plan1 : {
        id: 324
        years: [
            {

            }
        ]
    }

]
// put object into storage
localStorage.setItem("plans", JSON.stringify(plans));

// retreieve object from storage
var retrievedPlans = localStorage.getItem("plans");
console.log("plans: ", JSON.parse(retrievedObject));
*/
export function Scheduler(props: SchedulerProps): JSX.Element{
    if(props.csv === undefined && props.json === undefined){



        const years = useYears([{index: 1, uuid: uuid(), semesters: new Array<SemesterProps>()}]);
        
        const [numYears, setNumYears] = useLocalStorage("Years", "1");
        const [newPlan, setNewPlan] = useLocalStorage("Plan", "");
        const [newStart, setNewStart] = useState<string | null>(null);
        const [newEnd, setNewEnd] = useState<string | null>(null);
        const [currentForm, setCurrentForm] = useState<string | null>(null);
        const handleSemesterInput = (event: ChangeEvent<HTMLInputElement>) => {
            switch(event.target.name){
            case "season":
                setNewPlan(event.target.value);
                break;
            case "starts":
                setNewStart(event.target.value);
                break;
            case "ends":
                setNewEnd(event.target.value);
                break;
            }
        };
        const handleSemesterSubmit = (event: FormEvent<HTMLFormElement>,id: string) => {
            event.preventDefault();
            years.putSemester(id, uuid(),new Date(newStart as string),new Date(newEnd as string),newPlan as string);
        };
        return (
            <div>
                <form>
                    <input type="text" value={newPlan} onChange={(e) => setNewPlan(e.target.value)} placeholder="Full name" aria-label="fullname"></input>
                </form>
                {years.value.map((props: YearProps, i: number) => {
                    return (
                        <div data-testid={"Year"} key={props.uuid}>
                            <Year handleInput={handleSemesterInput} handleSubmit={(event: FormEvent<HTMLFormElement>) => {
                                handleSemesterSubmit(event,props.uuid);
                            }} semesters={props.semesters} uuid={props.uuid} index={i+1} formUuid={currentForm} setFormUuid={setCurrentForm}/>
                        </div>
                    );
                })}
                <button data-testid="addYearButton" onClick={() => {
                    years.push(uuid(),years.value.length);
                    setNumYears(numYears+1);
                }}>+</button>
            </div>
        );
    }
    return <></>;
}