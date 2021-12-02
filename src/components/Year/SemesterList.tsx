import React, { useMemo } from "react";
import SemesterProps from "../../interfaces/Semester";
import Col from "react-bootstrap/Col";
import SemesterDragger from "../SemesterDragger";
import CourseProps from "../../interfaces/Course";

export interface SemesterListProps {
    removeSemester: (uuid: string) => void;
    clearCourses: (semesterUuid: string) => void;
    courses: Array<CourseProps>;
    moveCourse: (uuid: string, destinationUuid: string) => void,
    addCourse: (course: CourseProps) => void,
    removeCourse: (uuid: string) => void,
    semesters: Array<SemesterProps>;
}

export default function SemesterList(props: SemesterListProps): JSX.Element {
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
        <>
            {sortedSemesters.map(
                (semesterProps: SemesterProps, index: number) => {
                    return (
                        <Col
                            className="mb-3"
                            data-testid={`semester ${index + 1}`}
                            key={semesterProps.uuid}
                        >
                            <SemesterDragger
                                acceptCourse={(uuid: string) => {
                                    props.moveCourse(uuid, semesterProps.uuid);
                                }}
                                courses={props.courses}
                                {...semesterProps}
                                removeSemester={() => {
                                    props.removeSemester(semesterProps.uuid);
                                }}
                                push={props.addCourse}
                                removeCourse={props.removeCourse}
                                clearCourses={() => {
                                    props.clearCourses(semesterProps.uuid);
                                }}
                            />
                        </Col>
                    );
                }
            )}
        </>
    );
}
