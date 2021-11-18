import React from "react";
import Course from "../components/Course";
import {screen, render} from "@testing-library/react";
import CourseProps from "../interfaces/Course";
import {v4 as uuid} from "uuid";

describe(Course, () => {
    const doNothingWithString = jest.fn<void, [string]>();
    const courseUuid = uuid();
    const defaultProps: CourseProps = {uuid: courseUuid, id: "CISC123", description: "", name: "test course", credits: 1, semester: "", coreqs: [], prereqs: []};
    it("Should call onClickEdit if you click the edit button", async () => {
        const onClickEditSpy = jest.fn<void, [string]>();
        render(<Course
            {...defaultProps}
            onClickEdit={onClickEditSpy}
            removeCourse={doNothingWithString}
        />);
        expect(onClickEditSpy).not.toHaveBeenCalled();
        screen.getByTestId("edit-course-button").click();
        expect(onClickEditSpy).toHaveBeenCalled();
        expect(onClickEditSpy).toHaveBeenLastCalledWith(courseUuid);
    });
    it("Should call removeCourse if you click the remove button", async () => {
        const removeCourseSpy = jest.fn<void, [string]>();
        render(<Course
            {...defaultProps}
            onClickEdit={doNothingWithString}
            removeCourse={removeCourseSpy}
        />);
        expect(removeCourseSpy).not.toHaveBeenCalled();
        
        screen.getByTestId("remove-course").click();
        expect(removeCourseSpy).toHaveBeenCalled();
        expect(removeCourseSpy).toHaveBeenLastCalledWith(courseUuid);

    });
});