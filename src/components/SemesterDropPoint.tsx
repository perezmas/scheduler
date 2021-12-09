import React from "react";
import Semester, {SemesterProps} from "./Semester";
import {useDrop} from "react-dnd";
import AbstractData from "../interfaces/Data";

export interface SemesterDropPointProps extends SemesterProps{
    acceptCourse: (uuid: string) => void
}

export default function SemesterDropPoint(props: SemesterDropPointProps): JSX.Element{
    const [,drop] = useDrop(() => ({
        accept: "COURSE",
        drop: (item: AbstractData) => {
            props.acceptCourse(item.uuid);
        } 
    }), [props.acceptCourse]);

    return <Semester
        ref={drop}
        {...props}
    ></Semester>;
}