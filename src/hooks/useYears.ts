import { useReducer } from "react";
import CourseProps from "../interfaces/Course";
import SemesterProps from "../interfaces/Semester";
import { YearProps } from "../interfaces/Year";
import AbstractProps from "../interfaces/Props";
interface AbstractAction {
    type:
        | "ADD YEAR"
        | "DELETE YEAR"
        | "UPDATE SEMESTER"
        | "ADD SEMESTER"
        | "DELETE SEMESTER"
        | "ADD COURSE"
        | "DELETE COURSE";
    uuid: string;
}

export interface AddSemesterAction extends AbstractAction {
    type: "ADD SEMESTER";
    semesterUuid: string;
    name: string;
    start: Date;
    end: Date;
}

export interface DeleteSemesterAction extends AbstractAction {
    type: "DELETE SEMESTER";
    semesterUuid: string;
}

export interface DeleteYearAction extends AbstractAction{
    type: "DELETE YEAR";
}

export interface AddYearAction extends AbstractAction {
    type: "ADD YEAR";
    uuid: string;
    index: number;
}

export function getByUUID<T extends AbstractProps>(
    state: Array<T>,
    uuid: string
): number {
    for (let i = 0; i < state.length; i++) {
        if (state[i].uuid === uuid) {
            return i;
        }
    }
    return -1;
}

function semesterReducer(
    prev: Array<YearProps>,
    action: AbstractAction
): Array<YearProps> {
    const next = prev.map((x: YearProps) => {
        return x;
    });
    switch (action.type) {
    case "ADD SEMESTER": {
        const semAction: AddSemesterAction = action as AddSemesterAction;
        const targetIndex: number = getByUUID(next, semAction.uuid);
        const target: YearProps = next[targetIndex];
        const newYear1 = new Array<SemesterProps>().concat(
            target.semesters
        );
        newYear1.push({
            name: semAction.name,
            start: semAction.start,
            end: semAction.end,
            uuid: semAction.semesterUuid,
            courses: new Map<string, CourseProps>(),
        });
        next[targetIndex] = {
            index: next[targetIndex].index,
            uuid: next[targetIndex].uuid,
            semesters: newYear1,
        };
        return next;
    }case "ADD YEAR": {
        const addYear = action as AddYearAction;
        const newYear2: YearProps = {
            index: addYear.index,
            uuid: addYear.uuid,
            semesters: new Array<SemesterProps>(),
        };
        next.push(newYear2);
        return next;
    }case "DELETE SEMESTER": {
        const removeSemester = action as DeleteSemesterAction;
        const targetIndex: number = getByUUID(next,removeSemester.uuid);
        const targetYear: YearProps = next[targetIndex];
        const newYear = targetYear.semesters.filter((semester: SemesterProps) => {
            return semester.uuid !== removeSemester.semesterUuid; 
        });
        next[targetIndex] = {index: next[targetIndex].index, uuid: next[targetIndex].uuid, semesters: newYear};
        return next;
    }case "DELETE YEAR": {
        const removeYear = action as DeleteYearAction;
        const output = next.filter((value: YearProps) => {
            return value.uuid !== removeYear.uuid;
        });
        return output;
    }
    default:
        throw Error(`${action.type} not implemented!`);
    }
}




function clearSemesters(years: Array<YearProps>, pusher: (uuid: string, index: number) => void, semesterRemover: (uuid: string, semesterUuid: string) => void, yearRemover: (uuid: string) => void, yearUuid?: string){
    if(yearUuid !== undefined && getByUUID(years,yearUuid) !== -1){
        for(const semester of years[getByUUID(years,yearUuid)].semesters){
            semesterRemover(yearUuid,semester.uuid);
        }
    }else if(yearUuid === undefined){
        const newYears: YearProps[] = new Array<YearProps>();
        for(const year of years){
            newYears.push({semesters: [], index: year.index, uuid: year.uuid});
            yearRemover(year.uuid);
        }
        for(const year of newYears){
            pusher(year.uuid,year.index);
        }
    }
}

interface Years{
    value: Array<YearProps>;
    push: (uuid: string, index: number) => void;
    putSemester: (
        uuid: string,
        semesterUuid: string,
        start: Date,
        end: Date,
        name: string
    ) => void;
    removeSemester: (
        uuid: string,
        semesterUuid: string
    ) => void;
    removeYear: (
        uuid: string
    ) => void;
    clear: (
        uuid?: string
    ) => void;
}

function useYears(init?: () => Array<YearProps>): Years {
    const [semesters, updateSemesters] = useReducer(
        semesterReducer,
        undefined,
        init === undefined ? () => {
            return new Array<YearProps>();
        } : init
    );

    const addYear = (uuid: string, index: number) => {
        const action: AddYearAction = {
            type: "ADD YEAR",
            uuid: uuid,
            index: index,
        };
        updateSemesters(action);
    };
    const addSemester = (
        uuid: string,
        semesterUuid: string,
        start: Date,
        end: Date,
        name: string
    ) => {
        const action: AddSemesterAction = {
            type: "ADD SEMESTER",
            uuid: uuid,
            name: name,
            start: start,
            end: end,
            semesterUuid: semesterUuid,
        };
        updateSemesters(action);
    };
    const removeSemester = (
        uuid: string,
        semesterUuid: string,
    ) => {
        const action: DeleteSemesterAction = {
            type: "DELETE SEMESTER",
            uuid: uuid,
            semesterUuid: semesterUuid
        };
        updateSemesters(action);
    };
    const removeYear = (
        uuid: string
    ) => {
        const action: DeleteYearAction = {
            type: "DELETE YEAR",
            uuid: uuid
        };
        updateSemesters(action);
    };
    return {value: semesters, push: addYear, putSemester: addSemester, removeSemester: removeSemester, removeYear: removeYear, clear: (uuid?: string) => {
        clearSemesters(semesters,addYear,removeSemester,removeYear,uuid);
    }};
}

export default useYears;
