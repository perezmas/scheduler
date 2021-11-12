import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Semester from "../components/Semester";
import CourseProps from "../interfaces/Course";
import {v4 as uuid} from "uuid";

describe(Semester, () => {
    const doNothing = jest.fn();
    const emptyCourses = new Map<string, CourseProps>();
    const semesterUuid = uuid();

    it("Displays its name", async () => {
        render(<Semester 
            uuid={semesterUuid}
            courses={emptyCourses}
            removeSemester={doNothing}
            updateCourses={doNothing}
            clearCourses={doNothing}
            name="fall"
            start={new Date("08-31-2021")}
            end={new Date("12-15-2021")}
        />);
        expect(screen.getByText("fall")).toBeInTheDocument();
    });
    it("it opens a course modal when you click add course button", async () => {
        render(<Semester 
            uuid={semesterUuid}
            courses={emptyCourses}
            removeSemester={doNothing}
            updateCourses={doNothing}
            clearCourses={doNothing}
            name="fall"
            start={new Date("08-31-2021")}
            end={new Date("12-15-2021")}
        />);
        screen.getByTestId("add-course-button").click();

        await screen.findByTestId("modal-add-course");
    });
    it("Closes the course modal when the close button is clicked", async () => {
        render(<Semester 
            uuid={semesterUuid}
            courses={emptyCourses}
            removeSemester={doNothing}
            updateCourses={doNothing}
            clearCourses={doNothing}
            name="fall"
            start={new Date("08-31-2021")}
            end={new Date("12-15-2021")}
        />);
        screen.getByTestId("add-course-button").click();

        await screen.findByTestId("modal-add-course");

        screen.getByText("Close Button").click();
        
        await waitFor(() => {
            expect(screen.queryByTestId("modal-add-course")).not.toBeInTheDocument();
        });
    });
    it("Opens an AddCourse modal when the edit course button is clicked", async () => {
        const testCourses = new Map<string, CourseProps>();
        testCourses.set(uuid(), {semester: semesterUuid, id: "CISC111", name: "Intro to testing", description: "We really need this", credits: 3, coreqs: [], prereqs: []});
        render(<Semester 
            uuid={semesterUuid}
            courses={testCourses}
            removeSemester={doNothing}
            updateCourses={doNothing}
            clearCourses={doNothing}
            name="fall"
            start={new Date("08-31-2021")}
            end={new Date("12-15-2021")}
        />);

        screen.getByTestId("edit-course-button").click();
        await screen.findByTestId("modal-add-course");
    });
    it("Calls updateCourses when you submit a form", async () => {
        const updateCoursesSpy = jest.fn();
        render(<Semester 
            uuid={semesterUuid}
            courses={emptyCourses}
            removeSemester={doNothing}
            updateCourses={updateCoursesSpy}
            clearCourses={doNothing}
            name="fall"
            start={new Date("08-31-2021")}
            end={new Date("12-15-2021")}
        />);
        screen.getByTestId("add-course-button").click();
        await screen.findByTestId("modal-add-course");

        fireEvent.change(screen.getByLabelText("Course ID"), {target: {value: "CISC112"}});
        fireEvent.change(screen.getByLabelText("Course Name"), {target: {value: "Intro to testing"}});

        expect(updateCoursesSpy).not.toHaveBeenCalled();
        screen.getByTestId("submit-course-button").click();
        expect(updateCoursesSpy).toHaveBeenCalled();
    });
    it("Calls the function to clear all courses when the clear button is clicked.", async () => {
        const courses = new Map<string, CourseProps>();
        const semesterUuid = uuid();
        const clearSpy = jest.fn();
        render(<Semester
            removeSemester={doNothing}
            clearCourses={clearSpy}
            name={"fall"}
            courses={courses}
            uuid={semesterUuid}
            updateCourses={doNothing}
            start={new Date("2021-08-31")}
            end={new Date("2021-12-15")}
        />);

        expect(clearSpy).not.toHaveBeenCalled();
        screen.getByTestId("clear-courses-button").click();
        expect(clearSpy).toHaveBeenCalled();
    });
});