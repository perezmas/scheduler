import { useReducer } from "react";

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

export interface DeleteYearAction extends AbstractAction {
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

function yearReducer(
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
        });
        next[targetIndex] = {
            index: next[targetIndex].index,
            uuid: next[targetIndex].uuid,
            semesters: newYear1,
        };
        return next;
    }
    case "ADD YEAR": {
        const addYear = action as AddYearAction;
        const newYear2: YearProps = {
            index: addYear.index,
            uuid: addYear.uuid,
            semesters: new Array<SemesterProps>(),
        };
        next.push(newYear2);
        return next;
    }
    case "DELETE SEMESTER": {
        const removeSemester = action as DeleteSemesterAction;
        const targetIndex: number = getByUUID(next, removeSemester.uuid);
        const targetYear: YearProps = next[targetIndex];
        const newYear = targetYear.semesters.filter(
            (semester: SemesterProps) => {
                return semester.uuid !== removeSemester.semesterUuid;
            }
        );
        next[targetIndex] = {
            index: next[targetIndex].index,
            uuid: next[targetIndex].uuid,
            semesters: newYear,
        };
        return next;
    }
    case "DELETE YEAR": {
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

function clearSemesters(
    years: Array<YearProps>,
    pusher: (uuid: string, index: number) => void,
    semesterRemover: (uuid: string, semesterUuid: string) => void,
    yearRemover: (uuid: string) => void,
    yearUuid?: string
) {
    if (yearUuid !== undefined && getByUUID(years, yearUuid) !== -1) {
        for (const semester of years[getByUUID(years, yearUuid)].semesters) {
            semesterRemover(yearUuid, semester.uuid);
        }
    } else if (yearUuid === undefined) {
        const newYears: YearProps[] = new Array<YearProps>();
        for (const year of years) {
            newYears.push({
                semesters: [],
                index: year.index,
                uuid: year.uuid,
            });
            yearRemover(year.uuid);
        }
        for (const year of newYears) {
            pusher(year.uuid, year.index);
        }
    }
}

export interface Years {
    /**The list of years in the schedule */
    value: Array<YearProps>;
    /**Adds a new year to a schedule. */
    push: (uuid: string, index: number) => void;
    /**Puts a semester into a year */
    putSemester: (
        /**The uuid of the year the semester is being added to. */
        uuid: string,
        /**The uuid of the new semester */
        semesterUuid: string,
        /**The start of the new semester */
        start: Date,
        /**The end of the new semester */
        end: Date,
        /**The name displayed to the user (likely the season the semester takes place in) */
        name: string
    ) => void;
    /**Removes a semester from the year */
    removeSemester: (
        /**The uuid of the year the semester is being removed from */
        uuid: string,
        /**The uuid of the semester being removed */
        semesterUuid: string) => void;
    removeYear: (uuid: string) => void;
    /**Clears all the semesters in a given year. If no year is supplied, deletes all semesters in value. */
    clear: (uuid?: string) => void;
}

/**Returns a Years interface to keep track of the years in a plan (see above)
 * @param init A funciton that returns an array of YearProps; this returns the initial value in the output's value field. If empty, the default value will be an empty array.
 * @returns A Years object (see above for usage.)
 */
function useYears(init?: () => Array<YearProps>): Years {
    const [years, updateYears] = useReducer(
        yearReducer,
        undefined,
        init === undefined
            ? () => {
                return new Array<YearProps>();
            }
            : init
    );

    const addYear = (uuid: string, index: number) => {
        const action: AddYearAction = {
            type: "ADD YEAR",
            uuid: uuid,
            index: index,
        };
        updateYears(action);
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
        updateYears(action);
    };
    const removeSemester = (uuid: string, semesterUuid: string) => {
        const action: DeleteSemesterAction = {
            type: "DELETE SEMESTER",
            uuid: uuid,
            semesterUuid: semesterUuid,
        };
        updateYears(action);
    };
    const removeYear = (uuid: string) => {
        const action: DeleteYearAction = {
            type: "DELETE YEAR",
            uuid: uuid,
        };
        updateYears(action);
    };
    return {
        value: years,
        push: addYear,
        putSemester: addSemester,
        removeSemester: removeSemester,
        removeYear: removeYear,
        clear: (uuid?: string) => {
            clearSemesters(years, addYear, removeSemester, removeYear, uuid);
        },
    };
}

export default useYears;
