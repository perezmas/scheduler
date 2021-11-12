import React, { FormEvent, useState } from "react";
import { CourseAction } from "../hooks/useCourses";
import CourseProps from "../interfaces/Course";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import SemesterProps from "../interfaces/Semester";
import AddCourse from "./AddCourse";
import Course from "./Course";

interface FullSemesterProps extends SemesterProps {
    /**The uuid's of all exiting courses */
    courses: Map<string, CourseProps>;
    /**A function that will delete this semester.*/
    removeSemester: () => void;
    /**A function that updates the courses object. */
    updateCourses: (action: CourseAction) => void;
    /**A function that clears all courses from this semester. */
    clearCourses: () => void;
}

/**Represents a single semester of courses within an academic year. */
const Semester = (props: FullSemesterProps): JSX.Element => {
    const [newCourse, setNewCourse] = useState<CourseProps>({
        id: "",
        name: "",
        description: "",
        credits: 0,
        semester: props.uuid,
        coreqs: [],
        prereqs: [],
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const courseToAdd: CourseProps = { ...newCourse };
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
    const unAttachCourse = (courseToRemove: CourseProps) => {
        const action: CourseAction = {
            type: "REMOVE COURSE",
            payload: courseToRemove,
        };
        props.updateCourses(action);
    };

    const onClickEdit = (courseToEdit: CourseProps) => {
        setNewCourse(courseToEdit);
        setIsOpen(true);
        setIsEditing(true);
    };
    const handleCourseSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const action: CourseAction = {
            type: "ADD COURSE",
            payload: newCourse,
        };

        props.updateCourses(action);
        setNewCourse({
            id: "",
            name: "",
            description: "",
            credits: 0,
            semester: props.uuid,
            coreqs: [],
            prereqs: [],
        });
        if (isEditing) setIsEditing(false);
    };
    const addedCourses = Array.from(props.courses.values())
        .filter((course) => course.semester === props.uuid)
        .map((course) => {
            return (
                <ListGroupItem key={course.id}>
                    {
                        <Course
                            {...course}
                            onClickEdit={onClickEdit}
                            onRemoveCourse={unAttachCourse}
                        />
                    }
                </ListGroupItem>
            );
        });

    return (
        <>
            <AddCourse
                courses={Array.from(props.courses.values())}
                defaultValues={newCourse}
                isEditing={isEditing}
                isOpen={isOpen}
                onClickClose={() => {
                    setIsOpen(false);
                    setIsEditing(false);
                }}
                onClickSubmit={(event: FormEvent<HTMLFormElement>) => {
                    handleCourseSubmit(event);
                }}
                onChange={handleOnChange}
            ></AddCourse>

            <span
                data-testid={`Semester ${
                    props.name
                } ${props.start.getUTCFullYear()}`}
            >
                {props.name}
            </span>
            <button
                data-testid={`Remove Semester ${
                    props.name
                } ${props.start.getUTCFullYear()}`}
                className="trigger"
                onClick={props.removeSemester}
            >
                -
            </button>

            <ListGroup className="courses">{addedCourses}</ListGroup>
            <button
                className="trigger"
                onClick={() => {
                    setIsOpen(true);
                }}
                data-testid="add-course-button"
            >
                +
            </button>
            <br />
            <button
                onClick={props.clearCourses}
                data-testid="clear-courses-button"
            >
                clear
            </button>
        </>
    );
};

export default Semester;
