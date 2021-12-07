import { useReducer } from "react";
import CourseData from "../interfaces/Course";
import PlanData from "../interfaces/Plan";
import YearData from "../interfaces/Year";
import { v4 as uuid } from "uuid";
import { getByUUID } from "./useYears";
import SemesterData from "../interfaces/Semester";

type PlanActionType = 
"ADD PLAN" |
  "SET YEARS"
| "SET SEMESTERS"
| "SET COURSES";

interface AbstractAction {
    type: PlanActionType;
    uuid: string;
}

export interface AddYearAction extends AbstractAction {
    type: "ADD YEARS";
    yearList: Array<YearData>;
}

export interface SetYearAction extends AbstractAction {
    type: "SET YEARS";
    yearList: Array<YearData>;
}

export interface SetSemesterAction extends AbstractAction {
    type: "SET SEMESTERS";
    semesterList: Array<SemesterData>;
}

export interface SetCourseAction extends AbstractAction {
    type: "SET COURSES";
    courseList: Array<CourseData>;
}


type PlanAction<T extends PlanActionType> = 
T extends "SET YEARS" ? SetYearAction :
T extends "SET SEMESTERS" ? SetSemesterAction : 
SetCourseAction

function PlanReducer<T extends PlanActionType>(
    prev: Array<PlanData>,
    action: PlanAction<T>
): Array<PlanData> {
    const next = prev.map((x: PlanData) => {
        return {...x};
    });
    switch (action.type) {
    case "ADD YEARS": {
        
    }
    case "SET YEARS": {
        const setYears = action as SetYearAction;
        const target = getByUUID(next, setYears.uuid);
        const years = setYears.yearList;
        next[target].years = years;
        return next;
    }
    case "SET SEMESTERS": {
        const setSemesters = action as SetSemesterAction;
        const target = getByUUID(next, setSemesters.uuid);
        const semesters = setSemesters.semesterList;
        next[target].semesters = semesters;
        return next;
    }
    case "SET COURSES": {
        const setCourses = action as SetCourseAction;
        const target = getByUUID(next, setCourses.uuid);
        const courses = setCourses.courseList;
        next[target].courses = courses;
        return next;
    }
    default:
        throw new Error("Unknown action type");
    }
}

export interface Plans {
    planList: Array<PlanData>;
    setYears: (uuid: string, yearList: Array<YearData>) => void;
}

function usePlans(initialPlans?: () => Array<PlanData>): Plans {
    const [plans, setPlans] = useReducer(
        PlanReducer,
        undefined,
        initialPlans === undefined
        ? () => {
            return new Array<PlanData>();
        } : initialPlans
    );

    const setYears = (uuid: string, yearList: Array<YearData>) => {
        setPlans({
            type: "SET YEARS",
            uuid: uuid,
            yearList: yearList,
        });
    };

    return {
        planList: plans,
        setYears
    };
}
export default usePlans;