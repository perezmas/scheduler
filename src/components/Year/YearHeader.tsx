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
                    <div>
                        {`Year ${props.index}`}
                        <Button
                            variant="success"
                            data-testid={`Year ${props.index} label`}
                            className="trigger"
                        >{`Year ${props.index} >`}</Button>
                    </div>
                }
                transitionTime={200}
            >
                <Card className=" p-2">
                    <Row>
                        <Col style={{ textAlign: "right" }}>
                            <button
                                onClick={props.clearSemesters}
                                data-testid={`clear-year ${props.index}`}
                            >
                                Clear
                            </button>
                        </Col>
                    </Row>
                    <Row
                        style={{ overflow: "auto" }}
                        data-testid="collapsible-content"
                    >
                        {props.children}
                    </Row>
                </Card>
            </Collapsible>
        </Container>
    );
}
