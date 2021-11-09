import React, { ChangeEvent, FormEvent } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

import ReactDOM from "react-dom";
import CourseProps from "../interfaces/Course";

interface AddNewCourseProps {
    courses: CourseProps[];
    isOpen: boolean;
    defaultValues: CourseProps;
    isEditing: boolean; // if true, then we are editing an existing course
    onClickClose: () => void;
    onClickSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const AddCourse = (props: AddNewCourseProps): JSX.Element | null => {
    if (!props.isOpen) return null;
    return ReactDOM.createPortal(
        <div>
            {/* <div className="non-modal-overlay" /> */}
            <div className="modal-add-course">
                <button onClick={props.onClickClose}>Close Button</button>

                <Form onSubmit={props.onClickSubmit}>
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
                                defaultValue={props.defaultValues.name}
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
                                type="text"
                                name="courseID"
                                placeholder="eg. CISC220"
                                onChange={props.onChange}
                                defaultValue={props.defaultValues.id}
                            />
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
                                defaultValue={props.defaultValues.credits}
                                onChange={props.onChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" as={Col}>
                            <Form.Label>Select Corequisites</Form.Label>
                            {props.courses
                                .filter(
                                    (course) =>
                                        course.id != props.defaultValues.id
                                )
                                .map((course: CourseProps) => (
                                    <Form.Check
                                        key={course.id}
                                        type="checkbox"
                                        label={course.name}
                                        name="courseCorequisites"
                                        value={course.id}
                                        defaultChecked={props.defaultValues.coreqs.includes(
                                            course.id
                                        )}
                                        onChange={props.onChange}
                                    />
                                ))}
                        </Form.Group>
                        <Form.Group className="mb-3" as={Col}>
                            <Form.Label>Select Prerequisites</Form.Label>
                            {props.courses
                                .filter(
                                    (course) =>
                                        course.id != props.defaultValues.id
                                )
                                .map((course: CourseProps) => (
                                    <Form.Check
                                        key={course.id}
                                        type="checkbox"
                                        label={course.name}
                                        name="coursePrerequisites"
                                        value={course.id}
                                        defaultChecked={props.defaultValues.prereqs.includes(
                                            course.id
                                        )}
                                        onChange={props.onChange}
                                    />
                                ))}
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="courseDescription">
                        <Form.Label>Course Description (Optional) </Form.Label>
                        <Form.Control
                            name="courseDescription"
                            as="textarea"
                            placeholder="enter the course description here"
                            defaultValue={props.defaultValues.description}
                            onChange={props.onChange}
                            style={{ height: "100px" }}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        {props.isEditing ? "Edit Course" : "Add Course"}
                    </Button>
                </Form>
            </div>
        </div>,
        (document.getElementById("modal-view") as Element) || document.body
    );
};

export default AddCourse;
