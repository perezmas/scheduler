import { getByUUID, Years } from "../../hooks/useYears";
import validate from "../validation/dates";
import { ChangeEvent } from "react";
import { ProblemsInterface } from "../../hooks/useProblems";
import {v4 as uuid} from "uuid";
import { FormEvent } from "react";

export function handleSemesterFormInput(event: ChangeEvent<HTMLInputElement>, newStart: string | null, newEnd: string | null, setNewName: (name: string | null) => void, setNewStart: (start: string | null) => void, setNewEnd: (end: string | null) => void, years: Years, currentForm: string | null, problems: ProblemsInterface): void{
    switch (event.target.name) {
    case "season": {
        setNewName(event.target.value);
        break;
    }
    case "starts": {
        const semesters =
                years.value[
                    getByUUID(years.value, currentForm as string)
                ].semesters;
        const newDate = new Date(event.target.value);
        const newProblems = validate(
            newDate,
            newEnd !== null ? new Date(newEnd) : null,
            semesters,
            "starts"
        );
        if (newEnd === null) {
            problems.clear("semester-form");
            if (newProblems.length === 1) {
                problems.add(newProblems[0]);
            }
        } else {
            problems.clear("semester-form");
            for (const problem of newProblems) {
                problems.add(problem);
            }
        }
        setNewStart(event.target.value);
        break;
    }
    case "ends": {
        const semesters =
                years.value[
                    getByUUID(years.value, currentForm as string)
                ].semesters;
        const newDate = new Date(event.target.value);
        const newProblems = validate(
            newStart !== null ? new Date(newStart) : null,
            newDate,
            semesters,
            "ends"
        );
        if (newEnd === null) {
            problems.clear("semester-form");
            if (newProblems.length === 1) {
                problems.add(newProblems[0]);
            }
        } else {
            problems.clear("semester-form");
            for (const problem of newProblems) {
                problems.add(problem);
            }
        }
        setNewEnd(event.target.value);
        break;
    }
    }
}

export function handleSemesterFormSubmit(event: FormEvent<HTMLFormElement>, id: string, newName: string | null, newStart: string | null, newEnd: string | null, resetForm: () => void, addSemester: (id: string, uuid: string, start: Date, end: Date, name: string) => void): void{
    event.preventDefault();
    if (newName !== null && newEnd !== null && newStart !== null) {
        addSemester(
            id,
            uuid(),
            new Date(newStart),
            new Date(newEnd),
            newName
        );
        resetForm();
    }
}