import React, { FC, useState } from "react";
import {
    FormControl,
    InputGroup,
    Button,
    Row,
    Col,
    Container,
} from "react-bootstrap";
import { RouteComponentProps, Link } from "react-router-dom";

type RequirementsProps = RouteComponentProps & {
    /**The current requirements. */
    requirements: string[];
    /**A function that removes a requirement from the list. */
    onRemoveRequirement: (requirement: string) => void;
    /**A function that adds requirements to the list. */
    onAddRequirement: (requirement: string) => void;
};

/**A component that displays the requirements for a specific CIS degree. */
const Requirements: FC<RequirementsProps> = (props): JSX.Element => {
    const { requirements, onRemoveRequirement, onAddRequirement } = props;
    const [newRequirement, setNewRequirement] = useState("");

    const onSubmit = () => {
        onAddRequirement(newRequirement);
    };
    return (
        <Container className="flex-column-reverse">
            <h3 className="center">Computer Science Requirements</h3>
            {requirements.map((requirement) => (
                <Row
                    key={requirement}
                    className="justify-content-md-center my-3"
                >
                    <Col xs lg="2">
                        {" "}
                        {requirement}{" "}
                    </Col>
                    <Col xs lg="2">
                        <Button
                            onClick={() => onRemoveRequirement(requirement)}
                            data-testid="remove-requirement"
                        >
                            Remove
                        </Button>
                    </Col>
                </Row>
            ))}
            <Row className="justify-content-md-center my-3">
                <InputGroup className="mb-3" style={{ width: "50%" }}>
                    <FormControl
                        placeholder="Requirement eg. CISC220"
                        value={newRequirement}
                        onChange={(el) => {
                            setNewRequirement(el.target.value);
                        }}
                        aria-label="Text input with button"
                        title="requirement-input"
                    />
                    <Button
                        variant="outline-secondary"
                        title="Action"
                        id="segmented-button-dropdown-2"
                        onClick={onSubmit}
                        data-testid="submit-requirement"
                    >
                        Add Course
                    </Button>
                </InputGroup>
            </Row>
        </Container>
    );
};

export default Requirements;
