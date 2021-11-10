import React, { FC, useState } from "react";
import { FormControl, InputGroup, Button } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";

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
        <>
            {" "}
            <ul>
                {requirements.map((requirement) => (
                    <li key={requirement}>
                        {requirement}
                        <Button
                            variant="danger"
                            onClick={() => onRemoveRequirement(requirement)}
                        >
                            Remove
                        </Button>
                    </li>
                ))}
            </ul>
            {requirements.map}
            <InputGroup className="mb-3">
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
        </>
    );
};

export default Requirements;
