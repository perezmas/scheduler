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

interface FullYearProps extends YearProps {
    courses: Courses;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    handleInput: (event: ChangeEvent<HTMLInputElement>) => void;
    formUuid: string | null;
    setFormUuid: (newId: string | null) => void;
    removeSemester: (semesterUuid: string) => void;
    clear: () => void;
    clearCourses: (semesterUuid: string) => void;
}

function Year(props: FullYearProps): JSX.Element {
    const overlayButton = useRef(null);
    const sortedSemesters = useMemo(() => {
        return props.semesters.sort((a: SemesterProps, b: SemesterProps) => {
            return a.start.getTime() - b.start.getTime();
        });
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
                                                    // coursesForThisSemester={Array.from(
                                                    //     props.courses.courseList.values()
                                                    // ).filter(
                                                    //     (course) =>
                                                    //         course.semester ===
                                                    //         semesterProps.uuid
                                                    // )}

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
                                            props.setFormUuid(
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
                                            props.setFormUuid(null);
                                        }}
                                        rootClose={true}
                                        transition={false}
                                    >
                                        <Popover id="popover-basic">
                                            <PopoverContent>
                                                <form
                                                    data-testid={`semester-form ${props.index}`}
                                                    onSubmit={
                                                        props.handleSubmit
                                                    }
                                                >
                                                    <label>season:</label>
                                                    <input
                                                        data-testid="season-input"
                                                        type="text"
                                                        name="season"
                                                        onChange={
                                                            props.handleInput
                                                        }
                                                    />
                                                    <br />
                                                    <label>starts:</label>
                                                    <input
                                                        data-testid="starts-input"
                                                        type="date"
                                                        name="starts"
                                                        onChange={
                                                            props.handleInput
                                                        }
                                                    />
                                                    <br />
                                                    <label>ends:</label>
                                                    <input
                                                        data-testid="ends-input"
                                                        type="date"
                                                        name="ends"
                                                        onChange={
                                                            props.handleInput
                                                        }
                                                    />
                                                    <br />
                                                    <input
                                                        data-testid="submit-button"
                                                        type="submit"
                                                        value="submit"
                                                    />
                                                </form>
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
/*

<Container className="container-sm">
            <Row>
                <Col>
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
                                                // coursesForThisSemester={Array.from(
                                                //     props.courses.courseList.values()
                                                // ).filter(
                                                //     (course) =>
                                                //         course.semester ===
                                                //         semesterProps.uuid
                                                // )}

                                                {...semesterProps}
                                                removeSemester={() => {
                                                    props.removeSemester(
                                                        semesterProps.uuid
                                                    );
                                                }}
                                                updateCourses={
                                                    props.courses.updateCourses
                                                }
                                                clearCourses={
                                                    () => {
                                                        props.clearCourses(semesterProps.uuid);
                                                    }
                                                }
                                            />
                                        </Col>
                                    );
                                }
                            )}

                            <Col>
*/
