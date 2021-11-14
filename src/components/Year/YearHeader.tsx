import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
} from "react-bootstrap";
import Collapsible from "react-collapsible";

interface YearHeaderProps {
    index: number,
    clearSemesters: () => void,
    children: JSX.Element | JSX.Element[]
}

export default function YearHeader(props: YearHeaderProps): JSX.Element{
    return <Container fluid>
        <Row className="mb-3">
            <Col md={11}>
                <Card className=" p-2">
                    <Collapsible
                        trigger={
                            <button
                                data-testid={`Year ${props.index} label`}
                                className="trigger"
                            >{`Year ${props.index} >`}</button>
                        }
                        transitionTime={200}
                    >
                        <Row data-testid="collapsible-content">
                            {props.children}
                        </Row>
                    </Collapsible>
                </Card>
            </Col>
            <Col>
                <button
                    onClick={props.clearSemesters}
                    data-testid={`clear-year ${props.index}`}
                >
                        Clear
                </button>
            </Col>
        </Row>
    </Container>;
}