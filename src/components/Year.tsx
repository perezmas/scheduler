import React, {useState, ChangeEvent, FormEvent, useRef} from "react";
import {YearProps} from "../interfaces/Year";
import Collapse from "react-bootstrap/Collapse";
import {Container, Row, Col, Popover, OverlayTrigger, PopoverContent, Overlay} from "react-bootstrap";
import SemesterProps from "../interfaces/Semester";

interface FullYearProps extends YearProps{
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void,
    handleInput: (event: ChangeEvent<HTMLInputElement>) => void
}

function Year(props: FullYearProps): JSX.Element{
    const [viewing, setViewing] = useState<boolean>(false);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const overlayButton = useRef(null);
    return (
        <Container className="container-sm">
            <Row>
                <div>
                    Year {props.index}
                    <button onClick={() => {
                        setViewing(!viewing);
                    }
                    }>{">"}</button>
                </div>
            </Row>
            <Collapse in={viewing}>
                <Row>
                    {props.semesters.map((semester: SemesterProps) => {
                        return (
                            <Col key={semester.uuid}>{semester.name}</Col>
                        );
                    })}
                    <Col>
                        <button ref={overlayButton} onClick={() => {
                            setFormOpen(!formOpen);
                        }}>+</button>
                        <Overlay target={overlayButton} placement="right-end" show={formOpen} onHide={() => {
                            setFormOpen(false);
                        }}rootClose={true}>
                            <Popover id="popover-basic">
                                <PopoverContent>
                                    <form onSubmit={props.handleSubmit}>
                                        <label>
                                            season: 
                                        </label>
                                        <input type="text" name="season" onChange={props.handleInput}/>
                                        <br/>
                                        <label>
                                            starts:
                                        </label>
                                        <input type="date" name="starts" onChange={props.handleInput}/>
                                        <br/>
                                        <label>
                                            ends:
                                        </label>
                                        <input type="date" name="ends" onChange={props.handleInput}/>
                                        <br/>
                                        <input type="submit" value="submit" />
                                    </form> </PopoverContent>
                            </Popover>
                        </Overlay>
                    </Col>
                </Row>
            </Collapse>
        </Container>

        
    );
}

export default Year;