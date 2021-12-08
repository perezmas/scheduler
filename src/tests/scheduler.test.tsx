import React from "react";
import {
    fireEvent,
    queryByText,
    render,
    screen,
    waitFor,
    getByTestId,
    queryByTestId,
    getByText,
} from "@testing-library/react";

import { act } from "react-dom/test-utils";
import { Scheduler, SchedulerProps } from "../components/Scheduler";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plans } from "../hooks/usePlans";

function WrappedScheduler(props: SchedulerProps): JSX.Element {
    return (
        <DndProvider backend={HTML5Backend}>
            <Scheduler {...props} />
        </DndProvider>
    );
}

async function openCourseDropdown(
    year: number,
    semester: number
): Promise<void> {
    getByTestId(
        getByTestId(screen.getByTestId(`Year ${year}`), `semester ${semester}`),
        "clear-courses-toggle"
    ).click();
    await screen.findByTestId("clear-courses-button");
}

async function addCourse(
    year: number,
    semester: number,
    name: string,
    id: string,
    description?: string
) {
    const yearElement = screen.getByTestId(`Year ${year}`);
    const semesterElement = getByTestId(yearElement, `semester ${semester}`);
    getByTestId(semesterElement, "add-course-button").click();

    await screen.findByTestId("course-form");

    const courseName = screen.getByLabelText("Course Name");
    const courseID = screen.getByLabelText("Course ID");
    const courseDescription = screen.getByLabelText(
        "Course Description (Optional)"
    );

    fireEvent.change(courseName, { target: { value: name } });
    fireEvent.change(courseID, { target: { value: id } });
    fireEvent.change(courseDescription, {
        target: { value: description !== undefined ? description : "" },
    });

    screen.getByTestId("submit-course-button").click();

    screen.getByTestId("close-course-form").click();

    await waitFor(() => {
        expect(screen.queryByTestId("course-form")).not.toBeInTheDocument();
    });
}

async function addSemester(
    name: string,
    start: string,
    end: string,
    year = 1
): Promise<void> {
    await openForm(year);

    const seasonBox = screen.getByTestId("season-input");
    const startBox = screen.getByTestId("starts-input");
    const endBox = screen.getByTestId("ends-input");

    fireEvent.change(seasonBox, { target: { value: name } });
    fireEvent.change(startBox, { target: { value: start } });
    fireEvent.change(endBox, { target: { value: end } });

    expect(screen.queryAllByTestId("error")).toHaveLength(0);

    const submit = screen.getByTestId("submit-button");
    submit.click();

    await waitFor(() => {
        expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
    });
}

async function openForm(year: number): Promise<void> {
    const yearElement = screen.getByTestId(`Year ${year}`);
    getByTestId(yearElement, "open-semester-form").click();
    await screen.findByTestId("popover");
}

async function testForError(
    baseline: [string, string],
    errorConditions: Array<["starts-input" | "ends-input", string]>,
    expectError: () => void,
    expectNoError: () => void,
    year = 1
) {
    await openForm(year);

    const startsBox = screen.getByTestId("starts-input");
    const endsBox = screen.getByTestId("ends-input");
    fireEvent.change(startsBox, { target: { value: baseline[0] } });
    fireEvent.change(endsBox, { target: { value: baseline[1] } });
    expectNoError();

    for (const condition of errorConditions) {
        const box = condition[0] === "starts-input" ? startsBox : endsBox;
        fireEvent.change(box, { target: { value: condition[1] } });
        expectError();

        fireEvent.change(box, {
            target: { value: box === startsBox ? baseline[0] : baseline[1] },
        });
        expectNoError();
    }
}

describe(Scheduler, () => {
    const defaultPlan: Plans = {
        addPlan: jest.fn<void, [string]>(),
        copyPlan: jest.fn<void, [string]>(),
        deletePlan: jest.fn<void, [string]>(),
        planList: [],
        setCourses: jest.fn<void, [string]>(),
        setYears: jest.fn<void, [string]>(),
    };
    beforeEach(() => {
        render(
            <WrappedScheduler
                requirements={[
                    "MATH243",
                    "IRSH-201",
                    "SCOT-201",
                    "STUFF-101",
                    "STUFF-102",
                ]}
                plans={defaultPlan}
                scheduleId="test"
            />
        );
    });

    it("Should start with 2 years and 3 semesters.", async () => {
        const year1 = screen.getByTestId("Year 1");
        const fall1 = getByTestId(year1, "semester 1");
        expect(getByText(fall1, "fall")).toBeInTheDocument();
        const spring = getByTestId(year1, "semester 2");
        expect(getByText(spring, "spring")).toBeInTheDocument();
        expect(queryByTestId(year1, "semester 3")).not.toBeInTheDocument();

        const year2 = screen.getByTestId("Year 2");
        const fall2 = getByTestId(year2, "semester 1");
        expect(getByText(fall2, "fall")).toBeInTheDocument();
        expect(queryByTestId(year2, "semester 2")).not.toBeInTheDocument();
    });

    it("Can add another year by pressing the button", async () => {
        let btn = screen.getByTestId("add-year-button");
        btn.click();
        expect(screen.getByTestId("Year 3")).toBeInTheDocument();
        for (let i = 0; i < 5; i++) {
            btn = screen.getByTestId("add-year-button");
            btn.click();
            expect(screen.getByTestId(`Year ${4 + i}`)).toBeInTheDocument();
        }
    });

    it("renders a form when you click on the new semester button", async () => {
        await openForm(1);

        const seasonBox = screen.getByTestId("season-input");
        const startBox = screen.getByTestId("starts-input");
        const endBox = screen.getByTestId("ends-input");

        expect(seasonBox).toBeInTheDocument();
        expect(startBox).toBeInTheDocument();
        expect(endBox).toBeInTheDocument();

        act(() => {
            const yearElement = screen.getByTestId("Year 1");
            getByTestId(yearElement, "open-semester-form").click();
        });

        await waitFor(() => {
            expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
        });
    });

    it("Allows you to submit the form iff all the fields are filled and there are no errors.", async () => {
        await openForm(1);
        const submit = screen.getByTestId("submit-button");
        const expectNoSubmission = () => {
            submit.click();
            expect(screen.queryByText("winter")).not.toBeInTheDocument();
            expect(screen.getByTestId("popover")).toBeInTheDocument();
        };

        const seasonBox = screen.getByTestId("season-input");
        const startsBox = screen.getByTestId("starts-input");
        const endsBox = screen.getByTestId("ends-input");
        expectNoSubmission();

        fireEvent.change(seasonBox, { target: { value: "winter" } });
        expectNoSubmission();

        fireEvent.change(endsBox, { target: { value: "2022-02-05" } });
        expectNoSubmission();

        fireEvent.change(endsBox, { target: { value: "" } });
        fireEvent.change(startsBox, { target: { value: "2022-01-03" } });
        expectNoSubmission();

        fireEvent.change(endsBox, { target: { value: "2022-01-01" } });
        expectNoSubmission();

        fireEvent.change(endsBox, { target: { value: "2022-02-05" } });

        fireEvent.change(endsBox, { target: { value: "" } }); //Check if submission is prevented if the box is emptied again after information has been put in it
        expectNoSubmission();

        fireEvent.change(endsBox, { target: { value: "2022-02-05" } });
        submit.click();

        await waitFor(() => {
            expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
        });
        expect(screen.getByText("winter")).toBeInTheDocument();
    });

    it("Allows you to add semesters to a year.", async () => {
        const year = screen.getByTestId("Year 1");
        expect(queryByTestId(year, "semester 3")).not.toBeInTheDocument();

        await addSemester("summer", "2024-09-01", "2024-12-15");

        const newSemester = getByTestId(year, "semester 3");
        expect(getByText(newSemester, "summer")).toBeInTheDocument();
    });

    it("Should be able to remove a semester through the dropdown menu inside it", async () => {
        await openCourseDropdown(1, 1);
        screen.getByTestId("remove-semester").click();
        expect(
            queryByText(
                getByTestId(screen.getByTestId("Year 1"), "semester 1"),
                "fall"
            )
        ).not.toBeInTheDocument();
    });

    it("Removes all the semesters in the plan when the clear button is clicked", async () => {
        screen.getByTestId("clear-remove-years-toggle").click();
        await screen.findByTestId("clear-years-button");
        screen.getByTestId("clear-years-button").click();

        expect(screen.queryByText("fall")).not.toBeInTheDocument();
        expect(screen.queryByText("spring")).not.toBeInTheDocument();
    });

    it("Removes all the semesters in a year when the clear button for a year is clicked", async () => {
        screen.getByTestId("add-year-button").click();
        screen.getByTestId("clear-year 1").click();

        expect(screen.getAllByText("fall")).toHaveLength(1);
    });

    it("Displays an error when the user enters a date into the starts field of a semester form that overlaps an existing semester.", async () => {
        await openForm(1);

        const startsBox = screen.getByTestId("starts-input");
        expect(
            screen.queryByText("starts overlaps with fall")
        ).not.toBeInTheDocument();
        fireEvent.change(startsBox, { target: { value: "2021-10-10" } });
        expect(
            screen.getByText("starts overlaps with fall")
        ).toBeInTheDocument();
        expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    it("Displays an error when the user enters a date into the ends field of a semester form that overlaps an existing semester", async () => {
        await openForm(1);

        const endsBox = screen.getByTestId("ends-input");
        expect(
            screen.queryByText("starts overlaps with fall")
        ).not.toBeInTheDocument();
        fireEvent.change(endsBox, { target: { value: "2021-10-10" } });
        expect(screen.getByText("ends overlaps with fall")).toBeInTheDocument();
        expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    it("Displays an error if the user tries to create a semester that starts after it ends.", async () => {
        const expectError = () => {
            expect(
                screen.getByText("Semesters cannot start after they end!")
            ).toBeInTheDocument();
            expect(screen.getByTestId("error")).toBeInTheDocument();
        };

        const expectNoError = () => {
            expect(
                screen.queryByText("Semesters cannot start after they end!")
            ).not.toBeInTheDocument();
            expect(screen.queryByTestId("error")).not.toBeInTheDocument();
        };

        await testForError(
            ["2022-08-31", "2022-12-15"],
            [
                ["starts-input", "2022-12-16"],
                ["ends-input", "2022-08-30"],
            ],
            expectError,
            expectNoError
        );
    });

    it("Displays an error if the user tries to add a semester that overlaps an existing one.", async () => {
        const expectError = () => {
            expect(screen.getByTestId("error")).toBeInTheDocument();
            const fallOverlap = screen.queryByText("Semester overlaps fall");
            const springOverlap = screen.queryByText(
                "Semester overlaps spring"
            );

            if (fallOverlap === null && springOverlap === null) {
                fail("Expected an overlap error");
            }
        };

        const expectNoError = () => {
            expect(
                screen.queryByText("Semester overlaps fall")
            ).not.toBeInTheDocument();
            expect(screen.queryByTestId("error")).not.toBeInTheDocument();
        };

        await testForError(
            ["2021-12-16", "2022-01-03"],
            [
                ["starts-input", "2021-12-15"],
                ["ends-input", "2022-02-08"],
            ],
            expectError,
            expectNoError
        );
    });

    it("Displays a warning iff a semester is three weeks or shorter.", async () => {
        const expectWarning = () => {
            expect(screen.getByTestId("warning")).toBeInTheDocument();
            expect(
                screen.getByText(
                    "Semester is less than three weeks long; is this a mistake?"
                )
            ).toBeInTheDocument();
        };

        const expectNoWarning = () => {
            expect(screen.queryByTestId("warning")).not.toBeInTheDocument();
            expect(
                screen.queryByText(
                    "Semester is less than three weeks long; is this a mistake?"
                )
            ).not.toBeInTheDocument();
        };

        await testForError(
            ["2022-08-31", "2022-12-15"],
            [
                ["ends-input", "2022-09-14"],
                ["starts-input", "2022-11-24"],
            ],
            expectWarning,
            expectNoWarning
        );
    });
    it("Prevents submission after emptying a field or an error is introduced", async () => {
        await openForm(1);

        act(() => {
            fireEvent.change(screen.getByTestId("season-input"), {
                target: { value: "fall" },
            });
            fireEvent.change(screen.getByTestId("starts-input"), {
                target: { value: "2021-08-31" },
            });
            fireEvent.change(screen.getByTestId("ends-input"), {
                target: { value: "2021-12-15" },
            });
        });
        expect(screen.getByTestId("submit-button")).not.toBeDisabled();
        act(() => {
            fireEvent.change(screen.getByTestId("starts-input"), {
                target: { value: "2021-12-30" },
            });
        });
        expect(screen.getByTestId("submit-button")).toBeDisabled();
    });
    it("Does not prevent submission if there are only warnings, not errors", async () => {
        await openForm(1);

        act(() => {
            fireEvent.change(screen.getByTestId("season-input"), {
                target: { value: "fall" },
            });
            fireEvent.change(screen.getByTestId("starts-input"), {
                target: { value: "2022-08-31" },
            });
            fireEvent.change(screen.getByTestId("ends-input"), {
                target: { value: "2022-09-14" },
            });
        });
        expect(screen.getByTestId("submit-button")).not.toBeDisabled();
    });
    it("Can remove a course from a semester", async () => {
        await addCourse(1, 1, "Irish Dance", "IRSH-201");
        await addCourse(
            1,
            1,
            "Intro to Scots",
            "SCOT-201",
            "No, we don't sound like scots wikipedia"
        );

        getByTestId(
            getByTestId(
                getByTestId(screen.getByTestId("Year 1"), "semester 1"),
                "Course IRSH-201: Irish Dance"
            ),
            "course-dropdown"
        ).click();

        (await screen.findByText("Remove")).click();

        expect(
            screen.queryByTestId("Course IRSH-201: Irish Dance")
        ).not.toBeInTheDocument();
        expect(
            screen.getByTestId("Course SCOT-201: Intro to Scots")
        ).toBeInTheDocument();
    });

    it("Can clear all the courses in a semester", async () => {
        await addCourse(1, 1, "Irish Dance", "IRSH-201");
        await addCourse(
            1,
            1,
            "Intro to Scots",
            "SCOT-201",
            "No, we don't sound like scots wikipedia."
        );
        await addCourse(1, 2, "Intro to stuff", "STUFF-101", "");
        await addCourse(2, 1, "Intro to more stuff", "STUFF-102");

        const yr1 = screen.getByTestId("Year 1");

        const fall = getByTestId(yr1, "semester 1");

        expect(screen.getByText("0 Irish Dance")).toBeInTheDocument();
        expect(screen.getByText("0 Intro to Scots")).toBeInTheDocument();

        await openCourseDropdown(1, 1);

        getByTestId(fall, "clear-courses-button").click();

        expect(screen.queryByText("0 Irish Dance")).not.toBeInTheDocument();
        expect(screen.queryByText("0 Intro to Scots")).not.toBeInTheDocument();

        expect(screen.getByText("0 Intro to stuff")).toBeInTheDocument();
        expect(screen.getByText("0 Intro to more stuff")).toBeInTheDocument();
    });
    it("Can add a course to a semester with prerequsites, corequisites, credits, a name, an id, and a description.", async () => {
        //coreqs
        await addCourse(1, 1, "Irish Dance", "IRSH-201");
        await addCourse(
            1,
            1,
            "Intro to Scots",
            "SCOT-201",
            "No, we don't sound like scots wikipedia."
        );

        //prereqs
        await addCourse(1, 1, "Intro to stuff", "STUFF-101", "");
        await addCourse(1, 1, "Intro to more stuff", "STUFF-102");

        getByText(
            getByTestId(screen.getByTestId("Year 1"), "semester 1"),
            "Add Course"
        ).click();
        await screen.findByTestId("course-form");

        fireEvent.change(screen.getByLabelText("Course Name"), {
            target: { value: "Intro to testing" },
        });
        fireEvent.change(
            screen.getByLabelText("Course Description (Optional)"),
            { target: { value: "Tedious but necessary" } }
        );
        fireEvent.change(screen.getByLabelText("Number of credits"), {
            target: { value: "3" },
        });
        fireEvent.change(screen.getByLabelText("Course ID"), {
            target: { value: "CISC201" },
        });
        screen.getByTestId("co-Intro to stuff").click();
        screen.getByTestId("co-Intro to more stuff").click();
        screen.getByTestId("co-Intro to more stuff").click();
        //currently the checkboxes need to be double clicked to disable them for unknown reasons.
        screen.getByTestId("co-Intro to more stuff").click();
        screen.getByTestId("pre-Irish Dance").click();
        screen.getByTestId("pre-Intro to Scots").click();
        screen.getByTestId("pre-Intro to Scots").click();
        screen.getByTestId("pre-Intro to Scots").click();
        screen.getByTestId("submit-course-button").click();
        expect(screen.getAllByTestId("course-dropdown")).toHaveLength(5);
    });

    it("Should allow you to drag courses from one semester to another", async () => {
        await addCourse(1, 1, "course", "CISC100");
        const course = screen.getByText("0 course");
        const target = getByTestId(
            getByTestId(screen.getByTestId("Year 1"), "semester 2"),
            "drop-point"
        );
        fireEvent.dragStart(course);
        fireEvent.drop(target);

        await waitFor(() => {
            expect(
                queryByText(
                    getByTestId(screen.getByTestId("Year 1"), "semester 1"),
                    "0 course"
                )
            ).not.toBeInTheDocument();
        });
        expect(getByText(target, "0 course")).toBeInTheDocument();
    });
    it("Should remove a year when the button to remove the appropriate year is clicked", async () => {
        getByTestId(
            screen.getByTestId("Year 1 label"),
            "open-dropdown"
        ).click();
        await waitFor(() => {
            expect(screen.queryByTestId("remove-year 1")).toBeInTheDocument();
        });
        screen.getByTestId("remove-year 1").click();
        expect(screen.queryByTestId("Year 1")).not.toBeInTheDocument();
    });
    it("Should remove all the years in the plan if the button to do so is clicked", async () => {
        screen.getByTestId("clear-remove-years-toggle").click();
        await waitFor(() => {
            expect(
                screen.queryByTestId("remove-years-button")
            ).toBeInTheDocument();
        });
        expect(screen.getByTestId("Year 1")).toBeInTheDocument();
        expect(screen.getByTestId("Year 2")).toBeInTheDocument();
        screen.getByTestId("remove-years-button").click();
        expect(screen.queryByTestId("Year 1")).not.toBeInTheDocument();
        expect(screen.queryByTestId("Year 2")).not.toBeInTheDocument();
    });
});

describe(Scheduler, () => {
    const defaultPlan: Plans = {
        addPlan: jest.fn<void, [string]>(),
        copyPlan: jest.fn<void, [string]>(),
        deletePlan: jest.fn<void, [string]>(),
        planList: [],
        setCourses: jest.fn<void, [string]>(),
        setYears: jest.fn<void, [string]>(),
    };

    it("Should display the requirements given to it as props", async () => {
        render(<WrappedScheduler requirements={["CISC123", "MATH243"]} plans={defaultPlan}
            scheduleId="test"/>);
        const requirements = screen.getByTestId("degree-requirements");
        expect(getByText(requirements, "CISC123")).toBeInTheDocument();
        expect(getByText(requirements, "MATH243")).toBeInTheDocument();
    });
    it("Should update classes of requirements from the requirements list if the course is in the semester", async () => {
            render(<WrappedScheduler requirements={["CISC123", "MATH243"]} plans={defaultPlan}
        scheduleId="test"/>);

        expect(screen.getByTestId("requirement-row-CISC123")).toHaveClass(
            "unmet"
        );
        expect(screen.getByTestId("requirement-row-MATH243")).toHaveClass(
            "unmet"
        );
        await addCourse(1, 1, "calculus I think", "MATH243", "");
        expect(screen.getByTestId("requirement-row-CISC123")).toHaveClass(
            "unmet"
        );
        expect(screen.getByTestId("requirement-row-MATH243")).toHaveClass(
            "met"
        );
        await addCourse(1, 1, "intro cs", "CISC123", "");
        expect(screen.getByTestId("requirement-row-CISC123")).toHaveClass(
            "met"
        );
        expect(screen.getByTestId("requirement-row-MATH243")).toHaveClass(
            "met"
        );
    });
});
