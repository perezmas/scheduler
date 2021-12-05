import React, { ChangeEvent, FormEvent } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import "./styles.css";

interface AddPlanNameProps {
    isOpen: boolean;
    defaultName: {
        planName: string;
    };
    isEditing: boolean; // if true, then we are editing an existing plan
    onClickClose: () => void;
    onClickSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function AddPlanName(props: AddPlanNameProps): JSX.Element {
    return (
        <div>
            <div className="modal-add-plan-name">
                <button onClick={props.onClickClose}>Close Button</button>

                <Form onSubmit={props.onClickSubmit}>
                    <Row className="mb-3">
                        <Form.Group
                            className="mb-3"
                            as={Col}
                            controlId="courseName"
                        >
                            <Form.Label>Plan Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Plan Name"
                                data-testid="planNameField"
                                name="planName"
                                defaultValue={props.defaultName.planName}
                                onChange={props.onChange}
                            />
                        </Form.Group>
                    </Row>
                    <Button variant="primary" type="submit">
                        {props.isEditing ? "Edit Plan" : "Add Plan"}
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default AddPlanName;
