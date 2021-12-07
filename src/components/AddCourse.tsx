import React, { ChangeEvent, FormEvent } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

import ReactDOM from "react-dom";
import CourseData from "../interfaces/Course";

interface AddNewCourseData {
    /**All of the existing courses. */
    courses: CourseData[];
    /** Degree requirements */
    requirements: Array<string>;
    /**Whether or not to display the form. */
    isOpen: boolean;
    /**The default values for fields that are left blank. */
    defaultValues: CourseData;
    /**Whether or not this component is currently modifying an existing course. */
    isEditing: boolean;
    /**A function that closes this form. */
    onClickClose: () => void;
    /**A function that is called when the user clicks the button to submit the form. */
    onClickSubmit: (event: FormEvent<HTMLFormElement>) => void;
    /**A function that is called when a field in the form is modified. */
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

/**A form that asks the user for the data required to create a new course. The form will be displayed in a modal attached to the document body via a portal. */
const AddCourse = (props: AddNewCourseData): JSX.Element | null => {
    if (!props.isOpen) return null;
    return ReactDOM.createPortal(
        <div>
            <div className="modal-add-course" data-testid="modal-add-course">
                <Button
                    variant="danger"
                    onClick={props.onClickClose}
                    data-testid="close-course-form"
                >
                    Cancel
                </Button>

                <Form onSubmit={props.onClickSubmit} data-testid="course-form">
                    <Row className="mb-3">
                        <Form.Group
                            className="mb-3"
                            as={Col}
                            controlId="courseName"
                        >
                            <Form.Label>Course Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Course Name"
                                data-testid="courseNameField"
                                name="courseName"
                                value={props.defaultValues.name}
                                onChange={props.onChange}
                            />
                            <Form.Text className="text-muted">
                                You can find this from{" "}
                                <a href="https://my.udel.edu/task/all/courses">
                                    this
                                </a>{" "}
                                course search.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            as={Col}
                            controlId="courseID"
                        >
                            <Form.Label>Course ID</Form.Label>
                            <Form.Control
                                as="select"
                                name="courseID"
                                aria-label="dropdown with multiple course ids to choose from"
                                onChange={props.onChange}
                                defaultValue={props.defaultValues.id}
                            >
                                <option>
                                    {props.defaultValues.id.length > 0
                                        ? props.defaultValues.id
                                        : "Choose a course ID"}
                                </option>
                                {props.requirements.map((requirement) => {
                                    return (
                                        <option
                                            key={requirement}
                                            value={requirement}
                                        >
                                            {requirement}
                                        </option>
                                    );
                                })}
                            </Form.Control>
                            <Form.Text className="text-muted">
                                This is used to check requirements. If you
                                don&apos;t see a course add it&apos;s course ID
                                in the requirements page instead.
                            </Form.Text>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group
                            className="mb-3"
                            as={Col}
                            controlId="courseCredits"
                        >
                            <Form.Label>Number of credits</Form.Label>
                            <Form.Control
                                type="number"
                                name="courseCredits"
                                placeholder="eg. 3"
                                value={props.defaultValues.credits}
                                onChange={props.onChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" as={Col}>
                            <Form.Label>Select Corequisites</Form.Label>
                            {props.courses.length > 0 ? (
                                props.courses
                                    .filter(
                                        (course) =>
                                            course.id != props.defaultValues.id
                                    )
                                    .map((course: CourseData) => (
                                        <Form.Check
                                            data-testid={`co-${course.name}`}
                                            key={course.uuid}
                                            type="checkbox"
                                            label={course.name}
                                            name="courseCorequisites"
                                            value={course.id}
                                            checked={props.defaultValues.coreqs.includes(
                                                course.id
                                            )}
                                            onChange={props.onChange}
                                        />
                                    ))
                            ) : (
                                <div> No courses to choose from. </div>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3" as={Col}>
                            <Form.Label>Select Prerequisites</Form.Label>
                            {props.courses.length > 0 ? (
                                props.courses
                                    .filter(
                                        (course) =>
                                            course.id != props.defaultValues.id
                                    )
                                    .map((course: CourseData) => (
                                        <Form.Check
                                            key={course.uuid}
                                            data-testid={`pre-${course.name}`}
                                            type="checkbox"
                                            label={course.name}
                                            name="coursePrerequisites"
                                            value={course.id}
                                            checked={props.defaultValues.prereqs.includes(
                                                course.id
                                            )}
                                            onChange={props.onChange}
                                        />
                                    ))
                            ) : (
                                <div> No courses to choose from. </div>
                            )}
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="courseDescription">
                        <Form.Label>Course Description (Optional) </Form.Label>
                        <Form.Control
                            name="courseDescription"
                            as="textarea"
                            placeholder="enter the course description here"
                            value={props.defaultValues.description}
                            onChange={props.onChange}
                            style={{ height: "100px" }}
                        />
                    </Form.Group>

                    <Button
                        variant="success"
                        type="submit"
                        data-testid="submit-course-button"
                    >
                        {props.isEditing ? "Edit Course" : "Add Course"}
                    </Button>
                </Form>
            </div>
        </div>,
        (document.getElementById("modal-view") as Element) || document.body
    );
};

export default AddCourse;
