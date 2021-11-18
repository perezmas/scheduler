import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Collapsible from "react-collapsible";

interface YearHeaderProps {
    index: number;
    clearSemesters: () => void;
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

                        <Button
                            variant="success"
                            onClick={props.clearSemesters}
                            data-testid={`clear-year ${props.index}`}
                            className="trigger"
                        >
                            {" "}
                            Clear Year
                        </Button>
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
