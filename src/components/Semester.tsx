import React, { FormEvent, useState } from "react";
import { CourseAction } from "../hooks/useCourses";
import CourseProps from "../interfaces/Course";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import SemesterProps from "../interfaces/Semester";
import AddCourse from "./AddCourse";
import Course from "./Course";

interface FullSemesterProps extends SemesterProps {
    courses: Map<string, CourseProps>;
    removeSemester: () => void;
    updateCourses: (action: CourseAction) => void;
    clearCourses: () => void;
}
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

    // console.log("Semester render!");

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const courseToAdd: CourseProps = { ...newCourse };
        console.log(event.target.name);
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
        console.log("Remove Course", courseToRemove.id);
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
