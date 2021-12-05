import React from "react";
import { screen, render, getByTestId } from "@testing-library/react";
import SemesterList from "../components/Year/SemesterList";
import { v4 as uuid } from "uuid";
import CourseData from "../interfaces/Course";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {SemesterListProps} from "../components/Year/SemesterList";

async function openCourseDropdown(semester: number): Promise<void> {
    getByTestId(
        screen.getByTestId(`semester ${semester}`),
        "clear-courses-toggle"
    ).click();
    await screen.findByTestId("clear-courses-button");
}
function WrappedSemesterList(props: SemesterListProps): JSX.Element{
    return (
        <DndProvider backend={HTML5Backend}>
            <SemesterList {...props}/>
        </DndProvider>
    );
}

describe(SemesterList, () => {
    const doNothingWithString = jest.fn<void, [string]>();
    const doNothingWithStrings = jest.fn<void, [string, string]>();
    const doNothingWithCourseData = jest.fn<void, [CourseData]>();
    const defaultProps: SemesterListProps = {
        semesters: [],
        removeSemester: doNothingWithString,
        clearCourses: doNothingWithString,
        courses: [],
        addCourse: doNothingWithCourseData,
        moveCourse: doNothingWithStrings,
        removeCourse: doNothingWithString,
    };
    it("Should be able to render a Semester if a SemesterProps object is passed to its Semesters prop.", async () => {
        const testProps: SemesterListProps = {...defaultProps};

        testProps.semesters.push({
            uuid: uuid(),
            name: "fall",
            start: new Date("08-31-2021"),
            end: new Date("12-15-2021"),
        });

        render(
            <WrappedSemesterList
                {...testProps}
            />
        );

        expect(screen.getByTestId("semester 1")).toBeInTheDocument();
    });
    it("Should be able to render several semesters sorted by their starting dates. Semesters with the same name should be numbered.", async () => {
        const testProps: SemesterListProps = {...defaultProps};
        testProps.semesters = [
            {
                name: "summer",
                start: new Date("2022-07-11"),
                end: new Date("2022-08-12"),
                uuid: uuid(),
            },
            {
                name: "spring",
                start: new Date("2022-02-07"),
                end: new Date("2022-05-26"),
                uuid: uuid(),
            },
            {
                name: "winter",
                start: new Date("2022-01-03"),
                end: new Date("2022-02-05"),
                uuid: uuid(),
            },
            {
                name: "fall",
                start: new Date("2021-08-31"),
                end: new Date("2021-12-18"),
                uuid: uuid(),
            },
            {
                name: "summer",
                start: new Date("2022-06-06"),
                end: new Date("2022-07-28"),
                uuid: uuid(),
            },
        ];

        render(
            <WrappedSemesterList
                {...testProps}
            />
        );

        const fall = screen.getByText("fall");
        const winter = screen.getByText("winter");
        const spring = screen.getByText("spring");
        const summer1 = screen.getByText("summer 1");
        const summer2 = screen.getByText("summer 2");

        const fallCol = screen.getByTestId("semester 1");
        const winterCol = screen.getByTestId("semester 2");
        const springCol = screen.getByTestId("semester 3");
        const summer1Col = screen.getByTestId("semester 4");
        const summer2Col = screen.getByTestId("semester 5");

        expect(fallCol).toContainElement(fall);
        expect(winterCol).toContainElement(winter);
        expect(springCol).toContainElement(spring);
        expect(summer1Col).toContainElement(summer1);
        expect(summer2Col).toContainElement(summer2);
    });
    it("Should call removeSemester if the remove-semester button in one of its child Semesters is clicked.", async () => {
        const removeSemesterSpy = jest.fn<void, [string]>();
        const semesterUuid = uuid();
        const testProps: SemesterListProps = {...defaultProps};
        testProps.semesters = [
            {
                name: "summer",
                start: new Date("2022-07-11"),
                end: new Date("2022-08-12"),
                uuid: semesterUuid,
            },
        ];
        testProps.removeSemester = removeSemesterSpy;

        render(
            <WrappedSemesterList
                {...testProps}
            />
        );
        await openCourseDropdown(1);

        expect(removeSemesterSpy).not.toHaveBeenCalled();
        screen.getByTestId("remove-semester").click();
        expect(removeSemesterSpy).toHaveBeenCalled();
        expect(removeSemesterSpy).toHaveBeenLastCalledWith(semesterUuid);
    });
    it("Should call clearCourses if the clear courses button in one of its Semester children is clicked", async () => {
        const clearCoursesSpy = jest.fn<void, [string]>();
        const semesterUuid = uuid();
        const testProps: SemesterListProps = {...defaultProps};
        testProps.clearCourses = clearCoursesSpy;
        testProps.semesters = [
            {
                name: "summer",
                start: new Date("2022-07-11"),
                end: new Date("2022-08-12"),
                uuid: semesterUuid,
            },
        ];

        render(
            <WrappedSemesterList
                {...testProps}
            />
        );
        await openCourseDropdown(1);

        expect(clearCoursesSpy).not.toHaveBeenCalled();
        screen.getByTestId("clear-courses-button").click();
        expect(clearCoursesSpy).toHaveBeenCalled();
        expect(clearCoursesSpy).toHaveBeenLastCalledWith(semesterUuid);
    });
    it("Should call courses.removeCourse if a course in one of the semesters is clicked", async () => {
        const semesterUuid1 = uuid();
        const courseUuid1 = uuid();
        const testProps: SemesterListProps = {...defaultProps};
        const removeCourseSpy = jest.fn<void,[string]>();
        testProps.courses = [
            {
                uuid: courseUuid1,
                semester: semesterUuid1,
                id: "CISC111",
                name: "Intro to testing",
                description: "We really need this",
                credits: 3,
                coreqs: [],
                prereqs: [],
            },
        ];
        testProps.semesters = [
            {
                name: "fall",
                start: new Date("2021-08-31"),
                end: new Date("2021-12-15"),
                uuid: semesterUuid1,
            },
        ];
        testProps.courses = [
            {
                uuid: courseUuid1,
                semester: semesterUuid1,
                id: "CISC111",
                name: "Intro to testing",
                description: "We really need this",
                credits: 3,
                coreqs: [],
                prereqs: [],
            },
        ];
        testProps.removeCourse = removeCourseSpy;

        render(
            <WrappedSemesterList
                {...testProps}
            />
        );
        expect(removeCourseSpy).not.toHaveBeenCalled();
        const semester = screen.getByTestId("semester 1");
        getByTestId(semester, "remove-course").click();
        expect(removeCourseSpy).toHaveBeenCalledTimes(1);
        expect(removeCourseSpy).toHaveBeenLastCalledWith(courseUuid1);
    });
});
