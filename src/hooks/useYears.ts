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

function getByUUID<T extends AbstractProps>(state: Array<T>, uuid: string): number{
    for(let i = 0;i < state.length; i++){
        if(state[i].uuid === uuid){
            return i;
        }
    }
    return -1;
}

function semesterReducer(prev: Array<YearProps> ,action: AbstractAction): Array<YearProps>{
    const next = new Array<YearProps>().concat(prev);
    switch(action.type){
    case "ADD SEMESTER": {
        const semAction: AddSemesterAction = action as AddSemesterAction;
        const targetIndex: number = getByUUID(prev,semAction.uuid);
        const target: YearProps = prev[targetIndex];
        if(getByUUID(target.semesters,semAction.semesterUuid) !== -1){
            return prev;
        }
        const newYear1 = new Array<SemesterProps>().concat(target.semesters);
        newYear1.push({name: semAction.name, start: semAction.start, end: semAction.end, uuid: semAction.semesterUuid, courses: new Map<string,CourseProps>()});
        next[targetIndex].semesters = newYear1;
        return next;
    }case "ADD YEAR": {
        const addYear = action as AddYearAction;
        const newYear2: YearProps = {index: addYear.index, uuid: addYear.uuid, semesters: new Array<SemesterProps>()};
        next.push(newYear2);
        return next;
    }default:
        throw Error(`${action.type} not implemented!`);
    }
}

function initializer(init?: Array<YearProps>): Array<YearProps>{
    if(init !== undefined){
        return init;
    }else{
        return new Array<YearProps>();
    }
}

interface Years{
    value: Array<YearProps>,
    push: (uuid: string, index: number) => void,
    putSemester: (uuid: string, semesterUuid: string, start: Date, end: Date, name: string) => void
}

function useYears(init?: Array<YearProps>): Years{
    const [semesters, updateSemesters] = useReducer(semesterReducer,init,initializer);
    const addYear = (uuid: string, index: number) => {
        const action: AddYearAction = {type: "ADD YEAR", uuid: uuid, index: index};
        updateSemesters(action);
    };
    const addSemester = (uuid: string, semesterUuid: string, start: Date, end: Date, name: string) => {
        const action: AddSemesterAction = {type: "ADD SEMESTER", uuid: uuid, name: name, start: start, end: end, semesterUuid: semesterUuid};
        updateSemesters(action);
    };
    return {value: semesters, push: addYear, putSemester: addSemester};
}

export default useYears;