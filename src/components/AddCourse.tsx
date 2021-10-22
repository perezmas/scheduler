import React, { ChangeEvent, FormEvent } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

import ReactDOM from "react-dom";

interface AddNewCourseProps {
    isOpen: boolean;
    onClickClose: () => void;
    onClickSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onChange: (event: ChangeEvent<HTMLFormElement>) => void;
}

const AddCourse = (props: AddNewCourseProps): JSX.Element | null => {
    // const [newName, setNewName] = useState<string>("");
    // const [newDescription, setNewDescription] = useState<string>("");

    if (!props.isOpen) return null;
    return ReactDOM.createPortal(
        <div>
            {/* <div className="non-modal-overlay" /> */}
            <div className="modal-add-course">
                <button onClick={props.onClickClose}>Close Button</button>

                <Form>
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
                                placeholder="eg. CISC220"
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="courseDescription">
                        <Form.Label>Course Description (Optional) </Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="enter the course description here"
                            style={{ height: "100px" }}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </div>,
        document.getElementById("modal-view") as Element
    );
};

export default AddCourse;
