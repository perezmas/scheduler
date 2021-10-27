import React from "react"; // eslint-disable-line no-unused-vars

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";
async function addSemester(
    name: string,
    start: string,
    end: string
): Promise<void> {
    screen.getByTestId("trigger 1").click();
    const form = await screen.findByTestId("semester-form 1");

    expect(form).toBeInTheDocument();

    const seasonBox = screen.getByTestId("season-input");
    const startBox = screen.getByTestId("starts-input");
    const endBox = screen.getByTestId("ends-input");

    fireEvent.change(seasonBox, { target: { value: name } });
    fireEvent.change(startBox, { target: { value: start } });
    fireEvent.change(endBox, { target: { value: end } });

    const submit = screen.getByTestId("submit-button");
    submit.click();

    await waitFor(() => {
        expect(screen.queryByTestId("semester-form 1")).not.toBeInTheDocument();
    });
}

describe("AddCourse", () => {
    beforeEach(() => {
        render(<App />);
    });

    test("Course should be added after clicking the submit button", async () => {
        await addSemester("summer 2", "2022-07-11", "2022-08-12");

        const { getByText, getByLabelText, getByTestId } = render(<App />);

        const addCourseButton = getByTestId("add-course-button");
        fireEvent.click(addCourseButton);

        const courseName = getByLabelText("Course Name");
        const courseID = getByLabelText("Course ID");
        const courseDescription = getByLabelText(
            "Course Description (Optional)"
        );

        fireEvent.change(courseName, { target: { value: "Test course" } });
        fireEvent.change(courseID, { target: { value: "CISC123" } });
        fireEvent.change(courseDescription, {
            target: { value: "Test description" },
        });

        const submitBtn = getByText("Add Course");
        fireEvent.click(submitBtn);

        expect(getByText("Test course")).toBeInTheDocument();
    });

    it("Should display the Add Course modal when the add course button is clicked", async () => {
        await addSemester("summer 2", "2022-07-11", "2022-08-12");
        const { getByTestId, getByLabelText } = render(<App />);
        const addCourseButton = getByTestId("add-course-button");
        fireEvent.click(addCourseButton);
        expect(getByLabelText("Course Name")).toBeInTheDocument();
    });
}); // addCourseTest ends here ...
