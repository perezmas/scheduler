import React, {ChangeEvent, FormEvent, useRef, useMemo} from "react";
import {YearProps} from "../interfaces/Year";
import Collapsible from "react-collapsible";
import {Container, Row, Col, Popover, PopoverContent, Overlay} from "react-bootstrap";
import SemesterProps from "../interfaces/Semester";

interface FullYearProps extends YearProps{
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void,
    handleInput: (event: ChangeEvent<HTMLInputElement>) => void,
    formUuid: string | null,
    setFormUuid: (newId: string | null) => void
}

const Year = React.forwardRef((props: FullYearProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const overlayButton = useRef(null);
    const sortedSemesters = useMemo(() => {
        return props.semesters.sort((a: SemesterProps, b: SemesterProps) => {
            return b.start.getTime() - a.start.getTime();
        });
    },[props.semesters]);
    return (
        <Container className="container-sm" ref={ref}>
            <Col>
                <Collapsible hidden={true} trigger={<button data-testid={`Year ${props.index} label`} className="trigger">{`Year ${props.index} >`}</button>} transitionTime={200}>
                    <Row>
                        {sortedSemesters.map((semester: SemesterProps) => {
                            return (
                                <Col key={semester.uuid}>{semester.name}</Col>
                            );
                        })}
                        <Col>
                            <button data-testid="trigger" className="trigger" ref={overlayButton} onClick={() => {
                                props.setFormUuid(props.formUuid === props.uuid ? null : props.uuid);
                            }}>+</button>
                            <Overlay target={overlayButton} placement="right-end" show={props.formUuid === props.uuid} onHide={() => {
                                props.setFormUuid(null);
                            }}rootClose={true} transition={false}>
                                <Popover id="popover-basic">
                                    <PopoverContent>
                                        <form data-testid="semester-form" onSubmit={props.handleSubmit}>
                                            <label>
                                                season: 
                                            </label>
                                            <input data-testid="season-input" type="text" name="season" onChange={props.handleInput}/>
                                            <br/>
                                            <label>
                                                starts:
                                            </label>
                                            <input data-testid="starts-input" type="date" name="starts" onChange={props.handleInput}/>
                                            <br/>
                                            <label>
                                                ends:
                                            </label>
                                            <input data-testid="ends-input" type="date" name="ends" onChange={props.handleInput}/>
                                            <br/>
                                            <input data-testid="submit-button" type="submit" value="submit" />
                                        </form> 
                                    </PopoverContent>
                                </Popover>
                            </Overlay>
                        </Col>
                    </Row>
                </Collapsible>
            </Col>
        </Container>    
    );
});
Year.displayName="Year";

export default Year;