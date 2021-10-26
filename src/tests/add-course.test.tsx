import React from "react"; // eslint-disable-line no-unused-vars

const CourseTest = (): JSX.Element => {
    return (
        <div>
            <h1>Course</h1>
        </div>
    );
};

export default CourseTest;

/*import { fireEvent, render } from "@testing-library/react";
import App from "../App";

const addCourseTest = () => {
    test("Add course", () => {
        const { getByText, getByPlaceholderText } = render(<App />);

        const courseName = getByPlaceholderText("Course name");
        const courseDuration = getByPlaceholderText("Course duration");
        const coursePrice = getByPlaceholderText("Course price");

        fireEvent.change(courseName, { target: { value: "Test course" } });
        fireEvent.change(courseDuration, { target: { value: "10" } });
        fireEvent.change(coursePrice, { target: { value: "100" } });

        const addCourseButton = getByText("Add course");
        fireEvent.click(addCourseButton);

        expect(getByText("Test course")).toBeInTheDocument();
    });
}; // addCourseTest ends here

const removeCourseTest = () => {
    test("Remove course", () => {
        const { getByText, getByPlaceholderText } = render(<App />);

        const courseName = getByPlaceholderText("Course name");
        const courseDuration = getByPlaceholderText("Course duration");
        const coursePrice = getByPlaceholderText("Course price");

        fireEvent.change(courseName, { target: { value: "Test course" } });
        fireEvent.change(courseDuration, { target: { value: "10" } });
        fireEvent.change(coursePrice, { target: { value: "100" } });

        const addCourseButton = getByText("Add course");
        fireEvent.click(addCourseButton);

        const removeCourseButton = getByText("Remove course");
        fireEvent.click(removeCourseButton);

        expect(getByText("Test course")).not.toBeInTheDocument();
    });
}; // removeCourseTest ends here

const addCourseAndRemoveCourseTest = () => {
    test("Add course and remove course", () => {
        const { getByText, getByPlaceholderText } = render(<App />);

        const courseName = getByPlaceholderText("Course name");
        const courseDuration = getByPlaceholderText("Course duration");
        const coursePrice = getByPlaceholderText("Course price");

        fireEvent.change(courseName, { target: { value: "Test course" } });
        fireEvent.change(courseDuration, { target: { value: "10" } });
        fireEvent.change(coursePrice, { target: { value: "100" } });

        const addCourseButton = getByText("Add course");
        fireEvent.click(addCourseButton);

        const removeCourseButton = getByText("Remove course");
        fireEvent.click(removeCourseButton);

        expect(getByText("Test course")).not.toBeInTheDocument();
    });
}; // addCourseAndRemoveCourseTest ends here
*/
