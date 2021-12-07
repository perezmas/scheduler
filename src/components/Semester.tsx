import React, { FormEvent, useState, useMemo } from "react";
import CourseData from "../interfaces/Course";
import {
    ListGroup,
    ListGroupItem,
    Card,
    Dropdown,
    ButtonGroup,
    Button,
} from "react-bootstrap";
import SemesterData from "../interfaces/Semester";
import AddCourse from "./AddCourse";
import Course from "./Course";
import { v4 as uuid } from "uuid";
import { getByUUID } from "../hooks/useYears";

export interface SemesterProps extends SemesterData {
    /**The uuid's of all exiting courses */
    courses: Array<CourseData>;
    /**The course ids of degree requirements eg. CISC220 etc.  */
    requirements: Array<string>;
    /**A function that will delete this semester.*/
    removeSemester: () => void;
    /**A function that removes a course from the global list. */
    removeCourse: (uuid: string) => void;
    /**A function that pushes courses into the global list. */
    push: (course: CourseData) => void;
    /**A function that clears all courses from this semester. */
    clearCourses: () => void;
}

function getEmptyCourse(semester: string): CourseData {
    return {
        id: "",
        name: "",
        description: "",
        credits: 0,
        semester: semester,
        coreqs: [],
        prereqs: [],
        uuid: uuid(),
    };
}

/**Represents a single semester of courses within an academic year. */
const Semester = React.forwardRef(
    (
        props: SemesterProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ): JSX.Element => {
        const [newCourse, setNewCourse] = useState<CourseData>(() => {
            return getEmptyCourse(props.uuid);
        });
        const [isOpen, setIsOpen] = useState(false);
        const [isEditing, setIsEditing] = useState(false);

        const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const courseToAdd: CourseData = { ...newCourse };

            switch (event.target.name) {
            case "courseName":
                courseToAdd.name = event.target.value;
                break;
            case "courseID":
                courseToAdd.id = event.target.value;
                break;
            case "courseDescription":
                courseToAdd.description = event.target.value;
                break;
            case "courseCredits":
                courseToAdd.credits = parseInt(event.target.value);
                break;
            case "courseCorequisites":
                courseToAdd.coreqs = event.target.checked
                    ? [...courseToAdd.coreqs, event.target.value]
                    : courseToAdd.coreqs.filter(
                        (x) => x !== event.target.value
                    );
                break;
            case "coursePrerequisites":
                courseToAdd.prereqs = event.target.checked
                    ? [...courseToAdd.prereqs, event.target.value]
                    : courseToAdd.prereqs.filter(
                        (x) => x !== event.target.value
                    );
                break;
            }
            setNewCourse(courseToAdd);
        };

        const onClickEdit = (uuid: string) => {
            setNewCourse(props.courses[getByUUID(props.courses, uuid)]);
            setIsOpen(true);
            setIsEditing(true);
        };
        const handleCourseSubmit = (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            props.push({ ...newCourse });
            if (!isEditing) {
                setNewCourse(getEmptyCourse(props.uuid));
            }
        };
        const semesterCourses = useMemo(() => {
            return props.courses.filter((course: CourseData) => {
                return course.semester === props.uuid;
            });
        }, [props.courses]);

        const totalCredits = useMemo(() => {
            return semesterCourses.reduce(
                (previousValue: CourseData, currentValue: CourseData) => {
                    return {
                        id: "",
                        description: "",
                        name: "",
                        credits: previousValue.credits + currentValue.credits,
                        semester: "",
                        coreqs: [],
                        prereqs: [],
                        uuid: "",
                    };
                },
                {
                    id: "",
                    description: "",
                    name: "",
                    credits: 0,
                    coreqs: [],
                    prereqs: [],
                    semester: "",
                    uuid: "",
                }
            ).credits;
        }, [semesterCourses]);

        return (
            <>
                <AddCourse
                    courses={props.courses}
                    requirements={props.requirements}
                    defaultValues={newCourse}
                    isEditing={isEditing}
                    isOpen={isOpen}
                    onClickClose={() => {
                        setIsOpen(false);
                        setIsEditing(false);
                        setNewCourse(getEmptyCourse(props.uuid));
                    }}
                    onClickSubmit={(event: FormEvent<HTMLFormElement>) => {
                        handleCourseSubmit(event);
                    }}
                    onChange={handleOnChange}
                ></AddCourse>
                <Card ref={ref}>
                    <Card.Header data-testid={"semester-name"}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            {`${props.name} `}
                            <Dropdown as={ButtonGroup}>
                                <Button
                                    onClick={() => {
                                        setIsOpen(true);
                                    }}
                                    data-testid="add-course-button"
                                    variant="success"
                                >
                                    Add Course
                                </Button>

                                <Dropdown.Toggle
                                    split
                                    variant="success"
                                    id="dropdown-split-basic"
                                    data-testid="clear-courses-toggle"
                                />

                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={props.clearCourses}
                                        data-testid="clear-courses-button"
                                    >
                                        Clear Semester
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        style={{ color: "#DC3E45" }}
                                        data-testid={"remove-semester"}
                                        onClick={props.removeSemester}
                                    >
                                        Remove Semester
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Card.Header>
                    <ListGroup className="courses" data-testid="drop-point">
                        {semesterCourses.map(
                            (course: CourseData, i: number) => {
                                return (
                                    <ListGroupItem
                                        className="course-item"
                                        key={i}
                                    >
                                        {
                                            <Course
                                                {...course}
                                                onClickEdit={onClickEdit}
                                                removeCourse={
                                                    props.removeCourse
                                                }
                                            />
                                        }
                                    </ListGroupItem>
                                );
                            }
                        )}
                    </ListGroup>
                    <Card.Footer
                        data-testid="credits-count"
                        className="text-muted"
                    >{`Credits: ${totalCredits}`}</Card.Footer>
                </Card>
            </>
        );
    }
);

Semester.displayName = "Semester";

export default Semester;
