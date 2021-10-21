import { Button, Col, Form, Row } from "react-bootstrap";
import ReactDOM from "react-dom";
import { AddCourseProps } from "../interfaces/AddCourse";

interface AddNewCourseProps extends AddCourseProps {
    isOpen: () => boolean;
    onClickClose: () => void;
}

const AddCourse = (props: AddNewCourseProps) => {
    if (!props.isOpen) return null;
    return ReactDOM.createPortal(
        <div>
            <div className="non-modal-overlay" />
            <div className="modal">
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
                                placeholder="Enter email"
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
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
        document.getElementById("modal-root") as Element
    );
};

export default AddCourse;
