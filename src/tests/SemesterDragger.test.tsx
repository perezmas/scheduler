import React from "react";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SemesterDragger, {SemesterDraggerProps} from "../components/SemesterDragger";
import {v4 as uuid} from "uuid";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import CourseData from "../interfaces/Course";
import AbstractData from "../interfaces/Data";

interface WrappedSemesterDraggerProps extends SemesterDraggerProps {
    draggableUuid: string
}

function WrappedSemesterDragger(props: WrappedSemesterDraggerProps): JSX.Element{
    return (
        <DndProvider backend={HTML5Backend}>
            <SemesterDragger {...props}/>
            <DraggableThing uuid={props.draggableUuid}/>
        </DndProvider>
    );
}

function DraggableThing(props: AbstractData): JSX.Element{
    const [,drag] = useDrag(() => ({
        type: "COURSE",
        item: {
            uuid: props.uuid
        }
    }),[props.uuid]);
    return (
        <div ref={drag} draggable={true}>
            drag me
        </div>
    );
}

describe(SemesterDragger, () => {
    const semesterUuid = uuid();
    const draggableUuid = uuid();
    const defaultProps: WrappedSemesterDraggerProps = {
        acceptCourse: jest.fn<void, [string]>(),
        courses: [],
        removeCourse: jest.fn<void, [string]>(),
        removeSemester: jest.fn<void,[void]>(),
        name: "fall",
        start: new Date("2021-08-31"),
        end: new Date("2021-12-15"),
        uuid: semesterUuid,
        push: jest.fn<void, [CourseData]>(),
        clearCourses: jest.fn<void, [void]>(),
        draggableUuid,
        requirements: []
    };
    it("Should call acceptCourse when something is dropped on it", async () => {
        const acceptCourseSpy = jest.fn<void, [string]>();
        const testProps: WrappedSemesterDraggerProps = {...defaultProps};
        testProps.acceptCourse = acceptCourseSpy;
        render(<WrappedSemesterDragger {...testProps}/>);
        fireEvent.dragStart(screen.getByText("drag me"));
        expect(acceptCourseSpy).not.toHaveBeenCalled();
        fireEvent.drop(screen.getByTestId("drop-point"));
        await waitFor(() => {
            expect(acceptCourseSpy).toHaveBeenCalled();
        });
        expect(acceptCourseSpy).toHaveBeenLastCalledWith(draggableUuid);
    });
});