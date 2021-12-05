import React from "react";
import Course, {FullCourseProps} from "../components/Course";
import {screen, render, fireEvent, waitFor} from "@testing-library/react";
import {v4 as uuid} from "uuid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import AbstractProps from "../interfaces/Props";

interface WrappedCourseProps extends FullCourseProps {
    acceptCourse: (uuid: string) => void
}

function WrappedCourse(props: WrappedCourseProps): JSX.Element{
    return (
        <DndProvider backend={HTML5Backend}>
            <Course {...props}/>
            <DropPoint acceptCourse={props.acceptCourse}/>
        </DndProvider>
    );
}

interface DropPointProps {
    acceptCourse: (uuid: string) => void
}

function DropPoint(props: DropPointProps): JSX.Element{
    const [,drop] = useDrop(() => ({
        accept: "COURSE",
        drop: (item: AbstractProps) => {
            props.acceptCourse(item.uuid);
        }
    }));
    return (
        <div ref={drop}>
            drop here
        </div>
    )
}

describe(Course, () => {
    const doNothingWithString = jest.fn<void, [string]>();
    const courseUuid = uuid();
    const defaultProps: WrappedCourseProps = {
        uuid: courseUuid,
        id: "CISC123",
        description: "",
        name: "test course",
        credits: 1,
        semester: "",
        coreqs: [],
        prereqs: [],
        acceptCourse: doNothingWithString,
        removeCourse: doNothingWithString,
        onClickEdit: jest.fn<void, [string]>()
    };

    it("Should call onClickEdit if you click the edit button", async () => {
        const onClickEditSpy = jest.fn<void, [string]>();
        const testProps: WrappedCourseProps = {...defaultProps};
        testProps.onClickEdit = onClickEditSpy;
        render(
            <WrappedCourse {...testProps}/>
        );
        expect(onClickEditSpy).not.toHaveBeenCalled();
        screen.getByTestId("edit-course-button").click();
        expect(onClickEditSpy).toHaveBeenCalled();
        expect(onClickEditSpy).toHaveBeenLastCalledWith(courseUuid);
    });
    it("Should call removeCourse if you click the remove button", async () => {
        const removeCourseSpy = jest.fn<void, [string]>();
        const testProps: WrappedCourseProps = {...defaultProps};
        testProps.removeCourse = removeCourseSpy;
        render(
            <WrappedCourse {...testProps}/>
        );
        expect(removeCourseSpy).not.toHaveBeenCalled();
        
        screen.getByTestId("remove-course").click();
        expect(removeCourseSpy).toHaveBeenCalled();
        expect(removeCourseSpy).toHaveBeenLastCalledWith(courseUuid);
    });
    it("Should be draggable", async () => {
        const acceptCourseSpy = jest.fn<void, [string]>();
        const testProps: WrappedCourseProps = {...defaultProps};
        testProps.acceptCourse = acceptCourseSpy;
        render(
            <WrappedCourse {...testProps}/>
        );

        fireEvent.dragStart(screen.getByText("1 test course"));
        fireEvent.drop(screen.getByText("drop here"));
        await waitFor(() => {
            expect(acceptCourseSpy).toHaveBeenCalled();
        })
        expect(acceptCourseSpy).toHaveBeenLastCalledWith(courseUuid);
    })
});