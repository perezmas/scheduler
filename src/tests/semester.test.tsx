import React from "react";
import { /*fireEvent,*/ render, screen } from "@testing-library/react";
// import App from "../App";
import Semester from "../components/Semester";
import CourseProps from "../interfaces/Course";
import { v4 as uuid } from "uuid";
// import { Scheduler } from "../components/Scheduler";
/*
describe("Semester", () => {
    beforeEach(() => {
        // render(<App />);
        render(<Scheduler requirements={[]} />);
    });

    // it("it opens course modal when you click edit course button", () => {
    //     screen.getAllByTestId("add-course-button")[0].click();

    //     const courseName = screen.getByLabelText("Course Name");
    //     const courseID = screen.getByLabelText("Course ID");
    //     const courseDescription = screen.getByLabelText(
    //         "Course Description (Optional)"
    //     );

    //     fireEvent.change(courseName, { target: { value: "Test course" } });
    //     fireEvent.change(courseID, { target: { value: "CISC123" } });
    //     fireEvent.change(courseDescription, {
    //         target: { value: "Test description" },
    //     });

    //     const submitBtn = screen.getByText("Add Course");
    //     fireEvent.click(submitBtn);

    //     expect(screen.getByText("Test course")).toBeInTheDocument();

    //     fireEvent.click(screen.getByTestId("edit-course-button"));
    //     expect(screen.getByText("Edit Course")).toBeInTheDocument();
    // });
    // it("");
    
    it("it updates course name when you edit course", () => {
        screen.getAllByTestId("add-course-button")[0].click();

        const courseName = screen.getByLabelText("Course Name");
        const courseID = screen.getByLabelText("Course ID");
        const courseDescription = screen.getByLabelText(
            "Course Description (Optional)"
        );

        fireEvent.change(courseName, { target: { value: "Test course" } });
        fireEvent.change(courseID, { target: { value: "CISC123" } });
        fireEvent.change(courseDescription, {
            target: { value: "Test description" },
        });

        const submitBtn = screen.getByText("Add Course");
        fireEvent.click(submitBtn);

        expect(screen.getByText("Test course")).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("edit-course-button"));

        const courseNameInput = screen.getByLabelText("Course Name");
        fireEvent.change(courseNameInput, {
            target: { value: "Test course 2" },
        });

        const submitBtn2 = screen.getByText("Edit Course");
        fireEvent.click(submitBtn2);

        expect(screen.getByText("Test course 2")).toBeInTheDocument();
    });
    
    
    it("removes the course when it is clicked on ", () => {
        screen.getAllByTestId("add-course-button")[0].click();

        const courseName = screen.getByLabelText("Course Name");
        const courseID = screen.getByLabelText("Course ID");
        const courseDescription = screen.getByLabelText(
            "Course Description (Optional)"
        );

        fireEvent.change(courseName, { target: { value: "Test course" } });
        fireEvent.change(courseID, { target: { value: "CISC123" } });
        fireEvent.change(courseDescription, {
            target: { value: "Test description" },
        });

        const submitBtn = screen.getByText("Add Course");
        fireEvent.click(submitBtn);

        expect(screen.getByText("Test course")).toBeInTheDocument();
        screen.getByText("Test course").click();
        expect(screen.queryByText("Test course")).not.toBeInTheDocument();
    });
});
*/
describe(Semester, () => {
    const doNothing = jest.fn();
    it("Calls the function to clear all courses when the clear button is clicked.", async () => {
        const courses = new Map<string, CourseProps>();
        const semesterUuid = uuid();
        courses.set(uuid(), {
            semester: semesterUuid,
            id: "CISC123",
            coreqs: [],
            prereqs: [],
            name: "intro to whatever",
            description: "",
            credits: 0,
        });
        courses.set(uuid(), {
            semester: semesterUuid,
            id: "CISC124",
            coreqs: [],
            prereqs: [],
            name: "Revenge of whatever",
            description: "",
            credits: 0,
        });

        const clearSpy = jest.fn();
        render(
            <Semester
                removeSemester={doNothing}
                clearCourses={clearSpy}
                name={"fall"}
                courses={courses}
                uuid={semesterUuid}
                updateCourses={doNothing}
                start={new Date("2021-08-31")}
                end={new Date("2021-12-15")}
            />
        );

        expect(clearSpy).not.toHaveBeenCalled();
        screen.getByTestId("clear-courses-button").click();
        expect(clearSpy).toHaveBeenCalled();
    });
});
