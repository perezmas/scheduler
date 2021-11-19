import React, { useRef } from "react";
import { Col, Card, Button } from "react-bootstrap";
import Popover from "react-bootstrap/Popover";
import PopoverContent from "react-bootstrap/PopoverContent";
import Overlay from "react-bootstrap/Overlay";

interface FormTriggerProps {
    currentForm: string | null;
    setForm: (newForm: string | null) => void;
    YearUuid: string;
    children: JSX.Element;
}

export default function FormTrigger(props: FormTriggerProps): JSX.Element {
    const overlayButton = useRef(null);
    return (
        <>
            <Col>
                <Card
                    bg="light"
                    className="add-semester-card"
                    style={{ flex: "0 0 auto" }}
                >
                    <Button
                        data-testid="open-semester-form"
                        ref={overlayButton}
                        onClick={() => {
                            props.setForm(
                                props.currentForm === props.YearUuid
                                    ? null
                                    : props.YearUuid
                            );
                        }}
                        id="add-semester-button"
                    >
                        Add a Semester +
                    </Button>
                </Card>
            </Col>
            <Col data-testid="form-trigger">
                <Overlay
                    target={overlayButton}
                    placement="top"
                    show={props.currentForm === props.YearUuid}
                    onHide={() => {
                        props.setForm(null);
                    }}
                    rootClose={true}
                    transition={false}
                >
                    <Popover id="popover-basic" data-testid="popover">
                        <PopoverContent>
                            <div data-testid={"semester-form"}>
                                {props.children}
                            </div>
                        </PopoverContent>
                    </Popover>
                </Overlay>
            </Col>
        </>
    );
}
