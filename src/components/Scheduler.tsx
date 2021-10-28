import React, {ChangeEvent, FormEvent} from "react";
import useYears from "../hooks/useYears";
import {v4 as uuid} from "uuid";
import SemesterProps from "../interfaces/Semester";
import { YearProps } from "../interfaces/Year";
import Year from "./Year";
import useLocalStorage from "../hooks/useLocalStorage";
interface SchedulerProps{
    csv?: string,
    json?: string
}
export function Scheduler(props: SchedulerProps): JSX.Element{
    if(props.csv === undefined && props.json === undefined){
        const years = useYears([{index: 1, uuid: uuid(), semesters: new Array<SemesterProps>()}]);
        const [numYears, setNumYears] = useLocalStorage("Years", 1);
        const [newName, setNewName] = useLocalStorage("Name", "");
        const [newStart, setNewStart] = useLocalStorage("New Start", "");
        const [newEnd, setNewEnd] = useLocalStorage("New End", "");
        const [currentForm, setCurrentForm] = useLocalStorage("Current Form", "");
        const [checked, setChecked] = useLocalStorage("checked", false);
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
                <form>
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" aria-label="fullname"></input>
                    <label>
                        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />{" "} Not a robot?</label><input type="submit" value="Submit"></input>
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