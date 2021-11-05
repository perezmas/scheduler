import React from "react"; // eslint-disable-line no-unused-vars

import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";

describe("AddCourse", () => {
    beforeEach(() => {
        render(<App />);
    });

    test("Course should be added after clicking the submit button", async () => {
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
    });

    it("Should display the Add Course modal when the add course button is clicked", async () => {
        screen.getAllByTestId("add-course-button")[0].click();
        expect(screen.getByLabelText("Course Name")).toBeInTheDocument();
    });

    it("Should close modal popup when close button is clicked", () => {
        screen.getAllByTestId("add-course-button")[0].click();
        expect(screen.getByLabelText("Course Name")).toBeInTheDocument();
        screen.getByText("Close Button").click();
        expect(screen.queryByLabelText("Course Name")).not.toBeInTheDocument();
    });
});
// addCourseTest ends here ...
