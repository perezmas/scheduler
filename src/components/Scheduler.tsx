import React, {ChangeEvent, FormEvent, useState} from "react";
import useYears from "../hooks/useYears";
import {v4 as uuid} from "uuid";
import SemesterProps from "../interfaces/Semester";
import { YearProps } from "../interfaces/Year";
import Year from "./Year";
interface SchedulerProps{
    csv?: string,
    json?: string
}
export function Scheduler(props: SchedulerProps): JSX.Element{
    const years = useYears([{index: 1, uuid: uuid(), semesters: new Array<SemesterProps>()}]);
    const [newName, setNewName] = useState<string | null>(null);
    const [newStart, setNewStart] = useState<string | null>(null);
    const [newEnd, setNewEnd] = useState<string | null>(null);
    const [currentForm, setCurrentForm] = useState<string | null>(null);
    const handleSemesterInput = (event: ChangeEvent<HTMLInputElement>) => {
        switch(event.target.name){
        case "season":
            setNewName(event.target.value);
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
        years.putSemester(id, uuid(),new Date(newStart as string),new Date(newEnd as string),newName as string);
    };
    return (
        <div>
            {years.value.map((props: YearProps, i: number) => {
                return (
                    <div key={props.uuid}>
                        <Year handleInput={handleSemesterInput} handleSubmit={(event: FormEvent<HTMLFormElement>) => {
                            handleSemesterSubmit(event,props.uuid);
                        }} semesters={props.semesters} uuid={props.uuid} index={i+1} formUuid={currentForm} setFormUuid={setCurrentForm}/>
                    </div>
                );
            })}
            <button onClick={() => {
                years.push(uuid(),years.value.length);
            }}>+</button>
        </div>
    );
}