import { useReducer } from "react";
import CourseProps from "../interfaces/Course";
import SemesterProps from "../interfaces/Semester";
interface AbstractAction{
    type: "UPDATE SEMESTER" | "ADD SEMESTER" | "DELETE SEMESTER" ,
    uuid: string
}

export interface AddSemesterAction extends AbstractAction{
    type: "ADD SEMESTER",
    name: string,
    start: Date,
    end: Date,
}

function isDate(dors: string | Date | undefined): dors is Date{
    return (dors as Date).getTime !== undefined;
}

function isString(dors: string | Date | undefined): dors is string{
    return dors !== undefined && (dors as Date).getTime === undefined;
}

function isAddSemester(action: AbstractAction): action is AddSemesterAction{
    const output: AddSemesterAction = (action as AddSemesterAction);
    return output.type === "ADD SEMESTER" && isString(output.name) && isDate(output.start) && isDate(output.end);
}

function semesterReducer(prev: Array<SemesterProps> ,action: AbstractAction){
    switch(action.type){
    case "ADD SEMESTER":
        if(isAddSemester(action)){
            const next = new Array<SemesterProps>().concat(prev);
            next.push({name: action.name, start: action.start, end: action.end, uuid: action.uuid, courses: new Map<string,CourseProps>()});
            return next;
        }else{
            throw Error(`Could not add semester ${action.uuid}; was the input object the right type?`);
        }default:
        throw Error(`${action.type} not implemented!`);
    }
}

function initializer(init?: Array<SemesterProps>): Array<SemesterProps>{
    if(init !== undefined){
        return init;
    }else{
        return new Array<SemesterProps>();
    }
}

function useSemesters(init?: Array<SemesterProps>): [Array<SemesterProps>,(action: AbstractAction) => void]{
    const [semesters, updateSemesters] = useReducer(semesterReducer,init,initializer);
    return [semesters, updateSemesters];
}

export default useSemesters;