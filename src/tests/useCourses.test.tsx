import { getByTestId, getByText, render, screen} from "@testing-library/react";
import React, {useState} from "react";
import useCourses from "../hooks/useCourses";
import CourseProps from "../interfaces/Course";
import {v4 as uuid} from "uuid";

interface TestuseCoursesProps{
    courseList: Array<CourseProps>
}

function TestuseCourses(props: TestuseCoursesProps): JSX.Element{
    return (
        <>
            <div data-testid="courses">
                {props.courseList.map((course: CourseProps, i: number) => {
                    return <CourseData key = {i} {...course} index={i}/>;
                })}
            </div>
            <div data-testid="courses-length">
                {props.courseList.length}
            </div>
        </>
    );
}

interface CourseDataProps extends CourseProps{
    index: number
}

function CourseData(props: CourseDataProps): JSX.Element{
    return (
        <div data-testid={`course ${props.index}`}>
            <div data-testid="uuid">
                {props.uuid}
            </div>
            <div data-testid="semester">
                {props.semester}
            </div>
            <div data-testid="prereqs">
                {props.prereqs.map((course: string, i: number) => {
                    <span key={i} data-testid={`prereq #${i}`}>
                        {course}
                    </span>;
                })}
                <div data-testid="prereqs-length">
                    {props.prereqs.length}
                </div>
            </div>
            <div data-testid="name">
                {props.name}
            </div>
            <div data-testid="id">
                {props.id}
            </div>
            <div data-testid="description">
                {props.description}
            </div>
            <div data-testid="credits">
                {props.credits}
            </div>
            <div data-testid="coreqs">
                {props.coreqs.map((course: string, i: number) => {
                    <span key={i} data-testid={`coreq #${i}`}>
                        {course}
                    </span>;
                })}
                <div data-testid="coreqs-length">
                    {props.coreqs.length}
                </div>
            </div>
        </div>
    );
}

function expectCourses(expected: Array<CourseProps>): void{
    const courses = screen.getByTestId("courses");
    const ln = screen.getByTestId("courses-length");
    expect(getByText(ln,expected.length)).toBeInTheDocument();

    for(let i = 0;i < expected.length; i++){
        const course = getByTestId(courses, `course ${i}`);
        const entries = Object.entries(expected[i]);
        for(const entry of entries){
            if(entry[0] === "uuid"){
                expect(getByTestId(course,"uuid")).toBeInTheDocument();
            }else{
                expect(getByText(getByTestId(course,entry[0]),entry[1])).toBeInTheDocument();
            }
        }
    }
}

describe(useCourses,() => {
    const courseUuid = uuid();
    const CISC123: CourseProps = {uuid: courseUuid, id: "CISC123", description: "", name: "test", coreqs: [], prereqs: [], credits: 0, semester: ""};
    it("initializes to an empty array if no argument is given", async () => {
        function InitTest(): JSX.Element{
            const courses = useCourses();
            return (
                <TestuseCourses courseList={courses.courseList}/>
            );
        }
        render(<InitTest/>);
        expectCourses([]);
    });
    it("Initializes to the array passed to the hook if one is passed", async () => {
        function InitWithParamTest(): JSX.Element{
            const courses = useCourses([CISC123]);
            return (
                <TestuseCourses courseList={courses.courseList}/>
            );
        }
        render(<InitWithParamTest/>);
        expectCourses([CISC123]);
    });
    it("Can add courses to the state with push", async () => {
        function PushCourseTest(): JSX.Element{
            const courses = useCourses();
            if(courses.courseList.length < 1){
                courses.push(CISC123);
            }
            return (
                <TestuseCourses courseList={courses.courseList}/>
            );
        }
        render(<PushCourseTest/>);
        expectCourses([CISC123]);
    });
    it("Can remove courses from the state with removeCourse", async () => {
        function RemoveCourseTest(): JSX.Element{
            const courses = useCourses([CISC123]);
            if(courses.courseList.length > 0){
                courses.removeCourse(courseUuid);
            }
            return (
                <TestuseCourses courseList={courses.courseList}/>
            );
        }
        render(<RemoveCourseTest/>);
        expectCourses([]);
    });
    it("Will do nothing if the removeCourse function is called on a nonexistent course", async () => {
        function RemoveCourseTest(): JSX.Element{
            const courses = useCourses([CISC123]);
            const [removed, setRemoved] = useState(true);
            if(removed){
                courses.removeCourse(uuid());
                setRemoved(false);
            }
            return (
                <TestuseCourses courseList={courses.courseList}/>
            );
        }
        render(<RemoveCourseTest/>);
        expectCourses([CISC123]);

    });
});