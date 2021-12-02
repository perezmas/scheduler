import React from "react";
import {
    Container,
    Row,
    Card,
    Button,
    ButtonGroup,
    Dropdown,
} from "react-bootstrap";
import Collapsible from "react-collapsible";

interface YearHeaderProps {
    index: number;
    clearYear: () => void;
    removeYear: () => void;
    children: JSX.Element | JSX.Element[];
}

export default function YearHeader(props: YearHeaderProps): JSX.Element {
    return (
        <Container fluid>
            <Collapsible
                trigger={
                    <div
                        data-testid={`Year ${props.index} label`}
                        className="year-collapsible-header"
                    >
                        {`Year ${props.index}`}
                        <Dropdown as={ButtonGroup}>
                            <Button
                                onClick={props.clearYear}
                                data-testid={`clear-year ${props.index}`}
                                variant="success"
                            >
                                Clear Year
                            </Button>

                            <Dropdown.Toggle
                                split
                                variant="success"
                                id="dropdown-split-basic"
                                data-testid="open-dropdown"
                            />

                            <Dropdown.Menu>
                                <Dropdown.Item
                                    style={{ color: "#DC3E45" }}
                                    onClick={props.removeYear}
                                    data-testid={`remove-year ${props.index}`}
                                >
                                    Remove Year
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                }
                transitionTime={200}
            >
                <Card className=" p-2">
                    <Row
                        md={4}
                        style={{ overflow: "auto", padding: "1.25rem 1.35rem" }}
                        data-testid="collapsible-content"
                    >
                        {props.children}
                    </Row>
                </Card>
            </Collapsible>
        </Container>
    );
}
