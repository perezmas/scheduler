import React, { ChangeEvent, FormEvent, useRef, useMemo } from "react";
import { YearProps } from "../interfaces/Year";
import Collapsible from "react-collapsible";
import {
    Container,
    Row,
    Col,
    Popover,
    Card,
    PopoverContent,
    Overlay,
} from "react-bootstrap";
import SemesterProps from "../interfaces/Semester";
import Semester from "./Semester";
import { Courses } from "../hooks/useCourses";
import SemesterForm from "./SemesterForm";

interface FullYearProps extends YearProps {
    /**The global list of courses */
    courses: Courses;
    /**The function to call when the form that creates semesters is submitted. */
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    /**The function to call when a field in the semester form is modified. */
    handleInput: (event: ChangeEvent<HTMLInputElement>) => void;
    /**The uuid of the year that is currently displaying the form to create a new semester. Null indicates no form is open. */
    formUuid: string | null;
    /**A function that removes a semester from the year. */
    removeSemester: (semesterUuid: string) => void;
    /**Whether or not the semester form can be submitted. */
    canSubmit: boolean;
    /**A function that clears out all semesters in this year.*/
    clear: () => void;
    /**A function that takes in the uuid of a semester and removes all courses from that semester. */
    clearCourses: (semesterUuid: string) => void;
    /**A function used to modify formUuid, as well as some other state variables used for input validation. */
    formInit: (uuid: string | null) => void;
}

/**Represents an academic year in a Scheduler containing a variable number of Semesters. */
function Year(props: FullYearProps): JSX.Element {
    const overlayButton = useRef(null);
    const sortedSemesters = useMemo(() => {
        return props.semesters
            .sort((a: SemesterProps, b: SemesterProps) => {
                return a.start.getTime() - b.start.getTime();
            })
            .map(
                (
                    semester: SemesterProps,
                    index: number,
                    array: Array<SemesterProps>
                ) => {
                    let count = 0;
                    for (let i = 0; i < index; i++) {
                        if (semester.name === array[i].name) {
                            count++;
                        }
                    }
                    const newSemester: SemesterProps = {
                        name:
                            count > 0
                                ? `${semester.name} ${count + 1}`
                                : semester.name,
                        end: semester.end,

                        uuid: semester.uuid,
                        start: semester.start,
                    };
                    for (
                        let i = index + 1;
                        i < array.length && semester.name === newSemester.name;
                        i++
                    ) {
                        if (array[i].name === semester.name) {
                            newSemester.name = `${semester.name} 1`;
                        }
                    }
                    return newSemester;
                }
            );
    }, [props.semesters]);
    return (
        <Container fluid>
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
                                {sortedSemesters.map(
                                    (
                                        semesterProps: SemesterProps,
                                        index: number
                                    ) => {
                                        return (
                                            <Col
                                                data-testid={`Year ${
                                                    props.index
                                                } semester ${index + 1}`}
                                                key={semesterProps.uuid}
                                            >
                                                <Semester
                                                    courses={
                                                        props.courses.courseList
                                                    }
                                                    {...semesterProps}
                                                    removeSemester={() => {
                                                        props.removeSemester(
                                                            semesterProps.uuid
                                                        );
                                                    }}
                                                    updateCourses={
                                                        props.courses
                                                            .updateCourses
                                                    }
                                                    clearCourses={() => {
                                                        props.clearCourses(
                                                            semesterProps.uuid
                                                        );
                                                    }}
                                                />
                                            </Col>
                                        );
                                    }
                                )}

                                <Col>
                                    <button
                                        data-testid={`trigger ${props.index}`}
                                        className="trigger"
                                        ref={overlayButton}
                                        onClick={() => {
                                            props.formInit(
                                                props.formUuid === props.uuid
                                                    ? null
                                                    : props.uuid
                                            );
                                        }}
                                    >
                                        +
                                    </button>
                                    <Overlay
                                        target={overlayButton}
                                        placement="right-end"
                                        show={props.formUuid === props.uuid}
                                        onHide={() => {
                                            props.formInit(null);
                                        }}
                                        rootClose={true}
                                        transition={false}
                                    >
                                        <Popover id="popover-basic">
                                            <PopoverContent>
                                                <div
                                                    data-testid={`semester-form ${props.index}`}
                                                >
                                                    <SemesterForm
                                                        canSubmit={
                                                            props.canSubmit
                                                        }
                                                        handleInput={
                                                            props.handleInput
                                                        }
                                                        handleSubmit={
                                                            props.handleSubmit
                                                        }
                                                    />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </Overlay>
                                </Col>
                            </Row>
                        </Collapsible>
                    </Card>
                </Col>
                <Col>
                    <button
                        onClick={props.clear}
                        data-testid={`clear-year ${props.index}`}
                    >
                        Clear
                    </button>
                </Col>
            </Row>
        </Container>
    );
}

export default Year;
