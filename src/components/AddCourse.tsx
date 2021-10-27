import React, { ChangeEvent, FormEvent } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

import ReactDOM from "react-dom";

interface AddNewCourseProps {
    isOpen: boolean;
    defaultValues: {
        courseName: string;
        courseID: string;
        courseDescription: string;
    };
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
                                defaultValue={props.defaultValues.courseName}
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
                                defaultValue={props.defaultValues.courseID}
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="courseDescription">
                        <Form.Label>Course Description (Optional) </Form.Label>
                        <Form.Control
                            name="courseDescription"
                            as="textarea"
                            placeholder="enter the course description here"
                            defaultValue={props.defaultValues.courseDescription}
                            onChange={props.onChange}
                            style={{ height: "100px" }}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Add Course
                    </Button>
                </Form>
            </div>
        </div>,
        document.getElementById("modal-view") as Element || document.body
    );
};

export default AddCourse;
