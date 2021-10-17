import React from "react";
import useSemesters from "../hooks/useSemesters";
import {YearProps} from "../interfaces/Year";
import courseProps from "../interfaces/Course";
import {v4 as uuid} from "uuid";

function Year(props: YearProps): JSX.Element{
    console.log(props.level);
    const semesters = useSemesters([{uuid: uuid(),name: "test", start: new Date("12/29/2000"), end: new Date("10/17/2021"), courses: new Map<string,courseProps>()}]);
    return (
        <div>
            {semesters[0].values().next().value.name}
        </div>
    );
}

export default Year;