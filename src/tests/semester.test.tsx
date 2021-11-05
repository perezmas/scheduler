import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";

describe("Semester", () => {
    beforeEach(() => {
        render(<App />);
    });

    it("it opens course modal when you click edit course button", () => {
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
        expect(screen.getByText("Edit Course")).toBeInTheDocument();
    });
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
