import React, {useMemo} from "react";
import SemesterProps from "../../interfaces/Semester";
import Col from "react-bootstrap/Col";
import Semester from "../Semester";
import { Courses } from "../../hooks/useCourses";

interface SemesterListProps {
    removeSemester: (uuid: string) => void,
    clearCourses: (semesterUuid: string) => void,
    courses: Courses,
    semesters: Array<SemesterProps>,

}

export default function SemesterList(props: SemesterListProps): JSX.Element{
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
        <React.Fragment>
            {sortedSemesters.map((semesterProps: SemesterProps,index: number) => {
                return (
                    <Col
                        data-testid={`semester ${index + 1}`}
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
                            push={
                                props.courses.push
                            }
                            removeCourse={
                                props.courses.removeCourse
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
        </React.Fragment> 
    );
}

