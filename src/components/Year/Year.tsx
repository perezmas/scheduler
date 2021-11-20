import React from "react";
import YearHeader from "./YearHeader";
import SemesterList from "./SemesterList";
import FormTrigger from "./FormTrigger";
import SemesterForm from "./SemesterForm";
import CourseProps from "../../interfaces/Course";
import { ChangeEvent, FormEvent } from "react";
import { Courses } from "../../hooks/useCourses";
import SemesterProps from "../../interfaces/Semester";

export interface FullYearProps {
    clearYear: () => void;
    removeYear: () => void;
    removeSemester: (uuid: string) => void;
    courses: Courses;
    index: number;
    uuid: string;
    handleSemesterSubmit: (
        event: FormEvent<HTMLFormElement>,
        uuid: string
    ) => void;
    handleSemesterInput: (event: ChangeEvent<HTMLInputElement>) => void;
    semesters: Array<SemesterProps>;
    currentForm: string | null;
    setForm: (newForm: string | null) => void;
    submissionAllowed: boolean;
}

export default function Year(props: FullYearProps): JSX.Element {
    return (
        <div data-testid={`Year ${props.index}`} key={props.uuid}>
            <YearHeader
                index={props.index}
                clearYear={() => {
                    props.clearYear();
                }}
                removeYear={() => {
                    props.removeYear();
                }}
            >
                <SemesterList
                    semesters={props.semesters}
                    courses={props.courses}
                    removeSemester={(semesterUuid: string) => {
                        props.removeSemester(semesterUuid);
                    }}
                    clearCourses={(semesterUuid: string) => {
                        for (const course of props.courses.courseList.filter(
                            (course: CourseProps) => {
                                return course.semester === semesterUuid;
                            }
                        )) {
                            props.courses.removeCourse(course.uuid);
                        }
                    }}
                />
                <FormTrigger
                    currentForm={props.currentForm}
                    setForm={props.setForm}
                    YearUuid={props.uuid}
                >
                    <SemesterForm
                        canSubmit={props.submissionAllowed}
                        handleInput={props.handleSemesterInput}
                        handleSubmit={(event: FormEvent<HTMLFormElement>) => {
                            props.handleSemesterSubmit(event, props.uuid);
                        }}
                    />
                </FormTrigger>
            </YearHeader>
        </div>
    );
}
