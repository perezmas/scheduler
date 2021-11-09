import React, { ChangeEvent, FormEvent, useState } from "react";
import useYears from "../hooks/useYears";
import { v4 as uuid } from "uuid";
import { YearProps } from "../interfaces/Year";

import useCourses from "../hooks/useCourses";
import Year from "./Year";


interface SchedulerProps {
    csv?: string;
    json?: string;
}

function getStartingYears(): Array<YearProps> {
    const year = new Date().getFullYear();
    const output = new Array<YearProps>();
    const yearOne: YearProps = { index: 1, uuid: uuid(), semesters: [] };
    yearOne.semesters.push({
        uuid: uuid(),
        name: "fall",
        start: new Date(`${year}-08-31`),
        end: new Date(`${year}-12-15`),
    });
    yearOne.semesters.push({
        uuid: uuid(),
        name: "spring",
        start: new Date(`${year + 1}-02-07`),
        end: new Date(`${year + 1}-05-26`),
    });
    const yearTwo: YearProps = { index: 2, uuid: uuid(), semesters: [] };
    yearTwo.semesters.push({
        uuid: uuid(),
        name: "fall",
        start: new Date(`${year + 1}-08-31`),
        end: new Date(`${year + 1}-12-15`),
    });
    output.push(yearOne);
    output.push(yearTwo);
    return output;
}

export function Scheduler(props: SchedulerProps): JSX.Element {
    if (props.csv === undefined && props.json === undefined) {
        const years = useYears(getStartingYears);

        const courses = useCourses(undefined);
        const [newName, setNewName] = useState<string | null>(null);
        const [newStart, setNewStart] = useState<string | null>(null);
        const [newEnd, setNewEnd] = useState<string | null>(null);
        const [currentForm, setCurrentForm] = useState<string | null>(null);
        const handleSemesterInput = (event: ChangeEvent<HTMLInputElement>) => {
            switch (event.target.name) {
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
        const handleSemesterSubmit = (
            event: FormEvent<HTMLFormElement>,
            id: string
        ) => {
            event.preventDefault();
            if (newName !== null && newEnd !== null && newStart !== null) {
                years.putSemester(
                    id,
                    uuid(),
                    new Date(newStart as string),
                    new Date(newEnd as string),
                    newName as string
                );
                setNewName(null);
                setNewStart(null);
                setNewEnd(null);
                setCurrentForm(null);
            }
        };
        return (
            <>
                <button
                    onClick={() => {
                        years.clear();
                    }}
                    data-testid="clear-button"
                >
                    Clear
                </button>
                <div>
                    {years.value.map((props: YearProps, i: number) => {
                        return (
                            <div data-testid={"Year"} key={props.uuid}>
                                <Year
                                    courses={courses}
                                    handleInput={handleSemesterInput}
                                    handleSubmit={(
                                        event: FormEvent<HTMLFormElement>
                                    ) => {
                                        handleSemesterSubmit(event, props.uuid);
                                    }}
                                    semesters={props.semesters}
                                    uuid={props.uuid}
                                    index={i + 1}
                                    formUuid={currentForm}
                                    setFormUuid={setCurrentForm}
                                    removeSemester={(semesterUuid: string) => {
                                        years.removeSemester(
                                            props.uuid,
                                            semesterUuid
                                        );
                                    }}
                                    clear={() => {
                                        years.clear(props.uuid);
                                    }}
                                />
                            </div>
                        );
                    })}
                    <button
                        data-testid="add-year-button"
                        onClick={() => {
                            years.push(uuid(), years.value.length);
                        }}
                    >
                        +
                    </button>
                </div>
            </>
        );
    }
    return <></>;
}
