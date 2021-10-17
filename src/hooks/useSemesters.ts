import { useReducer } from "react";
import CourseProps from "../interfaces/Course";
import SemesterProps from "../interfaces/Semester";

interface SemesterReducerAction{
    type: "ADD COURSE" | "UPDATE COURSE" | "UPDATE SEMESTER" | "DELETE COURSE" | "ADD SEMESTER",
    uuid: string,
    newValues: Map<"name" | "start" | "end",Date | string> | null,
    course: string | null
}

interface AddSemester extends SemesterReducerAction{
    type: "ADD SEMESTER",
    uuid: string,
    newValues: Map<"name" | "start" | "end",Date | string>
}

function isDate(dors: string | Date | undefined): dors is Date{
    return (dors as Date).getTime !== undefined;
}

function isString(dors: string | Date | undefined): dors is string{
    return dors !== undefined && (dors as Date).getTime === undefined;
}

function isAddSemester(action: SemesterReducerAction): action is AddSemester{
    return action.type === "ADD SEMESTER" && action.newValues !== null && isString(action.newValues.get("name")) && isDate(action.newValues.get("start")) && isDate(action.newValues.get("end"));
}

function semesterReducer(prev: Map<string,SemesterProps>, action: SemesterReducerAction){
    switch(action.type){
    case "ADD SEMESTER":
        if(isAddSemester(action)){
            const name = action.newValues.get("name");
            const start = action.newValues.get("start");
            const end = action.newValues.get("end");
            prev.set(action.uuid,{name: (name as string), start: (start as Date), end: (end as Date), uuid: action.uuid, courses: new Map<string,CourseProps>()});
            return prev;
        }else{
            throw Error(`Could not add semester ${action.uuid}; was the input object the right type?`);
        }default:
        throw Error(`${action.type} not implemented!`);
    }
}

function initSemesters(init: Array<SemesterProps> | undefined): Map<string,SemesterProps>{
    const output = new Map<string,SemesterProps>();
    if(init !== undefined){
        for(const sem of init){
            output.set(sem.uuid,sem);
        }
    }
    return output;
}

function useSemesters(init?: Array<SemesterProps>): [Map<string,SemesterProps>,(action: SemesterReducerAction) => void]{
    const [semesters, updateSemesters] = useReducer(semesterReducer,init,initSemesters);
    return [semesters, updateSemesters];
}

export default useSemesters;