import { useReducer } from "react";
import CourseProps from "../interfaces/Course";
import SemesterProps from "../interfaces/Semester";
import { YearProps } from "../interfaces/Year";
import AbstractProps from "../interfaces/Props";
interface AbstractAction{
    type: "ADD YEAR" | "DELETE YEAR" | "UPDATE SEMESTER" | "ADD SEMESTER" | "DELETE SEMESTER",
    uuid: string
}

export interface AddSemesterAction extends AbstractAction{
    type: "ADD SEMESTER",
    semesterUuid: string,
    name: string,
    start: Date,
    end: Date,
}

export interface AddYearAction extends AbstractAction{
    type: "ADD YEAR",
    uuid: string,
    index: number
}

function isDate(dors: string | Date | undefined): dors is Date{
    return (dors as Date).getTime !== undefined;
}

function isString(dors: string | Date | undefined): dors is string{
    return dors !== undefined && (dors as Date).getTime === undefined;
}

function isAddSemester(action: AbstractAction): action is AddSemesterAction{
    const output: AddSemesterAction = (action as AddSemesterAction);
    return output.type === "ADD SEMESTER" && isString(output.name) && isDate(output.start) && isDate(output.end) && isString(output.semesterUuid);
}

function isAddYear(action: AbstractAction): action is AddYearAction{
    const output: AddYearAction = (action as AddYearAction);
    return action.type === "ADD YEAR" && output.index !== undefined && typeof output.index === "number";
}

function getByUUID<T extends AbstractProps>(state: Array<T>, uuid: string): number{
    for(let i = 0;i < state.length; i++){
        if(state[i].uuid === uuid){
            return i;
        }
    }
    return -1;
}

function semesterReducer(prev: Array<YearProps> ,action: AbstractAction): Array<YearProps>{
    switch(action.type){
    case "ADD SEMESTER":
        if(isAddSemester(action)){
            const targetIndex: number = getByUUID(prev,action.uuid);
            const target: YearProps = prev[targetIndex];
            if(getByUUID(target.semesters,action.semesterUuid) !== -1){
                return prev;
            }
            const next = new Array<YearProps>().concat(prev);
            const newYear = new Array<SemesterProps>().concat(target.semesters);
            newYear.push({name: action.name, start: action.start, end: action.end, uuid: action.semesterUuid, courses: new Map<string,CourseProps>()});
            next[targetIndex].semesters = newYear;
            return next;
        }
        break;
    case "ADD YEAR":
        if(isAddYear(action)){
            const next = new Array<YearProps>().concat(prev);
            const newYear: YearProps = {index: action.index, uuid: action.uuid, semesters: new Array<SemesterProps>()};
            next.push(newYear);
            return next;
        }
        break;
    default:
        throw Error(`${action.type} not implemented!`);
    }
    throw Error(`action does not have required fields to execute ${action.type}!`);
}

function initializer(init?: Array<YearProps>): Array<YearProps>{
    if(init !== undefined){
        return init;
    }else{
        return new Array<YearProps>();
    }
}

function useYears(init?: Array<YearProps>): [Array<YearProps>,(action: AbstractAction) => void]{
    const [semesters, updateSemesters] = useReducer(semesterReducer,init,initializer);
    return [semesters, updateSemesters];
}

export default useYears;