import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import "./styles.css";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import PlanProps from "../interfaces/Plan";
import { YearProps } from "../interfaces/Year";
import ReactDOM from "react-dom";


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


const addPlanNameModal = (props: AddPlanNameProps) => {
    //if (!props.isOpen) return null;
    return (
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
                                defaultValue={props.defaultName.planName}
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
                    </Row>
                    <Button variant="primary" type="submit">
                        {props.isEditing ? "Edit Plan" : "Add Plan"}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default addPlanNameModal;