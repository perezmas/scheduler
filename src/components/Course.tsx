import React from "react";
import CourseData from "../interfaces/Course";
import { useDrag } from "react-dnd";
import { Dropdown, Button, ButtonGroup } from "react-bootstrap";

export interface CourseProps extends CourseData {
    /**A function that deletes this course from the global map containing all courses. */
    removeCourse: (uuid: string) => void;
    /**A function that is called when the user clicks the edit button to edit this course. */
    onClickEdit: (uuid: string) => void;
}

/**A component that represents a course. */
const Course = (props: CourseProps): JSX.Element => {
    const [, drag] = useDrag(
        () => ({
            type: "COURSE",
            item: {
                uuid: props.uuid,
            },
        }),
        [props.uuid]
    );
    interface ToggleProps {
        children?: React.ReactNode;
        onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => null;
    }
    const CustomToggle = React.forwardRef(
        (props: ToggleProps, ref: React.Ref<HTMLAnchorElement>) => (
            <a
                className="course-kebab-menu"
                href=""
                ref={ref}
                onClick={(e) => {
                    e.preventDefault();
                    if (props.onClick) props.onClick(e);
                }}
            >
                {props.children}
            </a>
        )
    );

    CustomToggle.displayName = "CustomToggle";

    return (
        <div
            ref={drag}
            draggable={true}
            data-testid={`Course ${props.id}: ${props.name}`}
            className="course"
        >
            <div style={{ display: "inline-block" }}>
                {`${props.credits} ${props.name}`}
            </div>
            <Dropdown style={{ display: "inline-block" }}>
                <Dropdown.Toggle as={CustomToggle}>
                    <i className="fa fa-ellipsis-v"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item
                        className="trigger"
                        data-testid="edit-course-button"
                        onClick={() => {
                            props.onClickEdit(props.uuid);
                        }}
                    >
                        Edit
                    </Dropdown.Item>
                    <Dropdown.Item
                        style={{ color: "#DC3E45" }}
                        className="trigger"
                        data-testid="remove-course"
                        onClick={() => {
                            props.removeCourse(props.uuid);
                        }}
                    >
                        Remove
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default Course;
