import React, {useRef} from "react";
import Col from "react-bootstrap/Col";
import Popover from "react-bootstrap/Popover";
import PopoverContent from "react-bootstrap/PopoverContent";
import Overlay from "react-bootstrap/Overlay";

interface FormTriggerProps{
    currentForm: string | null,
    setForm: (newForm: string | null) => void,
    YearUuid: string,
    children: JSX.Element
}

export default function FormTrigger(props: FormTriggerProps): JSX.Element{
    const overlayButton = useRef(null);
    return (
        <Col>
            <button
                data-testid="open-semester-form"
                className="trigger"
                ref={overlayButton}
                onClick={() => {
                    props.setForm(
                        props.currentForm === props.YearUuid
                            ? null
                            : props.YearUuid
                    );
                }}
            >
                +
            </button>
            <Overlay
                target={overlayButton}
                placement="right-end"
                show={props.currentForm === props.YearUuid}
                onHide={() => {
                    props.setForm(null);
                }}
                rootClose={true}
                transition={false}
            >
                <Popover id="popover-basic">
                    <PopoverContent>
                        <div
                            data-testid={"semester-form"}
                        >
                            {props.children}
                        </div>
                    </PopoverContent>
                </Popover>
            </Overlay>
        </Col>
    );
}