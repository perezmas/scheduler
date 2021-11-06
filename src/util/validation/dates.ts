import SemesterProps from "../../interfaces/Semester";
import { Problem } from "../../hooks/useProblems";
import {v4 as uuid} from "uuid";

export default function validate(start: Date | null, end: Date | null, existing: Array<SemesterProps>, source: string): Array<Problem>{
    if(start !== null && end !== null){
        return validate_both_dates(start, end,existing);
    }else if(start !== null){
        return validate_single_date(start, existing, source);
    }else if(end !== null){
        return validate_single_date(end, existing, source);
    }else{
        return [];
    }
}

function validate_both_dates(start: Date, end: Date, existing: Array<SemesterProps>): Array<Problem>{
    const output = new Array<Problem>();
    if(start.getTime() >= end.getTime()){
        output.push({uuid: uuid(), error: true, source: "semester-form", message: "Semesters cannot start after they end!",  key: "semester-starts-after-ends"});
    }else if(end.getTime() - start.getTime() <= 1814400000){
        output.push({uuid: uuid(), error: false, source: "semester-form", message: "Semester is less than three weeks long; is this a mistake?",  key: "short-semester"});
    }

    for(const semester of existing){
        if(end.getTime() >= semester.start.getTime() && semester.end.getTime() >= start.getTime()){
            output.push({uuid: uuid(), error: true, source: "semester-form", message: `Semester overlaps ${semester.name}`,  key: "semester-overlap"});
        }
    }
    return output;

}

function validate_single_date(date: Date, existing: Array<SemesterProps>, source: string): Array<Problem>{
    const output = new Array<Problem>();
    for(const semester of existing){
        if(date.getTime() > semester.start.getTime() && date.getTime() < semester.end.getTime()){
            output.push({uuid: uuid(), error: true, source: "semester-form", message: `${source} overlaps with ${semester.name}`, key: `semester-${source}-overlap`});
        }
    }
    return output;
}