import React, { useMemo, useState, ChangeEvent, FormEvent } from "react";
import useSemesters, {AddSemesterAction} from "../hooks/useSemesters";
import {YearProps} from "../interfaces/Year";
import courseProps from "../interfaces/Course";
import {v4 as uuid} from "uuid";
import Collapse from "react-bootstrap/Collapse";
import {Container, Row, Col, Popover, OverlayTrigger, PopoverContent} from "react-bootstrap";
import SemesterProps from "../interfaces/Semester";

function Year(props: YearProps): JSX.Element{
    const [semesters, updateSemesters] = useSemesters([{uuid: uuid(),name: "Fall", start: new Date("12/29/2000"), end: new Date("10/17/2021"), courses: new Map<string,courseProps>()},{uuid: uuid(),name: "Spring", start: new Date("12/29/2000"), end: new Date("10/17/2021"), courses: new Map<string,courseProps>()}]);
    const [viewing, setViewing] = useState(false);
    const [newName, setNewName] = useState<string | null>(null);
    const [newStart, setNewStart] = useState<string | null>(null);
    const [newEnd, setNewEnd] = useState<string | null>(null);
    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        switch(event.target.name){
        case "season":
            setNewName(event.target.value);
            break;
        case "starts":
            setNewStart(event.target.value);
            break;
        case "ends":
            setNewEnd(event.target.value);
            break;
        }
    };
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const input: AddSemesterAction = {type: "ADD SEMESTER", uuid: uuid(), name: newName as string, start: new Date(newStart as string), end: new Date(newEnd as string)};
        updateSemesters(input);
    };
    const semestersList = useMemo(() => {
        const output = new Array<SemesterProps>();
        const sems = semesters.values();
        for(let semester = sems.next();!semester.done;semester =sems.next()){
            output.push(semester.value);
        }
        return output.sort((a: SemesterProps,b: SemesterProps) => {
            if(a.start.getTime() < b.start.getTime()){
                return -1;
            }
            return 1;
        });
    },[semesters]);
    
    
    return (
        <Container className="container-sm">
            <Row>
                <div>
                    Year {props.num}
                    <button onClick={() => {
                        setViewing(!viewing);
                    }
                    }>{">"}</button>
                </div>
            </Row>
            <Collapse in={viewing}>
                <Row>
                    {semestersList.map((semester: SemesterProps) => {
                        return (
                            <Col key={semester.uuid}>{semester.name}</Col>
                        );
                    })}
                    <Col>
                        <OverlayTrigger trigger="click" placement="right-end" overlay={<Popover id="popover-basic">
                            <PopoverContent>
                                <form onSubmit={handleSubmit}>
                                    <label>
                                        season: 
                                    </label>
                                    <input type="text" name="season" onChange={handleInput}/>
                                    <br/>
                                    <label>
                                        starts:
                                    </label>
                                    <input type="date" name="starts" onChange={handleInput}/>
                                    <br/>
                                    <label>
                                        ends:
                                    </label>
                                    <input type="date" name="ends" onChange={handleInput}/>
                                    <br/>
                                    <input type="submit" value="submit" />
                                </form>
                            </PopoverContent>
                        </Popover>}>
                            <button>+</button>
                        </OverlayTrigger>
                    </Col>
                </Row>
            </Collapse>
        </Container>

        
    );
}

export default Year;