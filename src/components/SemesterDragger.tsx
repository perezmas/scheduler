import React from "react";
import Semester, {FullSemesterProps} from "./Semester";
import {useDrop} from "react-dnd";
import AbstractProps from "../interfaces/Props";

export interface SemesterDraggerProps extends FullSemesterProps{
    acceptCourse: (uuid: string) => void
}

export default function SemesterDragger(props: SemesterDraggerProps): JSX.Element{
    const [,drop] = useDrop(() => ({
        accept: "COURSE",
        drop: (item: AbstractProps) => {
            props.acceptCourse(item.uuid);
        } 
    }), [props.acceptCourse]);

    return <Semester
        ref={drop}
        courses={props.courses}
        clearCourses={props.clearCourses}
        removeSemester={props.removeSemester}
        push={props.push}
        name={props.name}
        start={props.start}
        end={props.end}
        removeCourse={props.removeCourse}
        uuid={props.uuid}
    ></Semester>;
}