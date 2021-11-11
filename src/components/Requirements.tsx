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
    requirements: string[];
    onRemoveRequirement: (requirement: string) => void;
    onAddRequirement: (requirement: string) => void;
};

const Requirements: FC<RequirementsProps> = (props): JSX.Element => {
    const { requirements, onRemoveRequirement, onAddRequirement } = props;
    const [newRequirement, setNewRequirement] = useState("");

    const onSubmit = () => {
        onAddRequirement(newRequirement);
    };
    return (
        <Container flex-column-reverse>
            <h3>Computer Science Requirements</h3>
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
                            // variant=""
                            onClick={() => onRemoveRequirement(requirement)}
                        >
                            Remove
                        </Button>
                    </Col>
                </Row>
            ))}
            <Row className="justify-content-md-center my-3">
                {requirements.map}
                <InputGroup className="mb-3" style={{ width: "50%" }}>
                    <FormControl
                        placeholder="Requirement eg. CISC220"
                        value={newRequirement}
                        onChange={(el) => {
                            setNewRequirement(el.target.value);
                        }}
                        aria-label="Text input with button"
                    />
                    <Button
                        variant="outline-secondary"
                        title="Action"
                        id="segmented-button-dropdown-2"
                        onClick={onSubmit}
                        // alignRight
                    >
                        Add Course
                    </Button>
                </InputGroup>
            </Row>
            <Link to="/">
                <Button>Back</Button>
            </Link>
        </Container>
    );
};

export default Requirements;
