import React, { FormEvent, useState } from "react";

import SemesterProps from "../interfaces/Semester";
import AddCourse from "./AddCourse";

// interface AddCourseAction {
//     type: "ADD COURSE";
//     payload: CourseProps;
// }

// const courseReducer = (
//     state: Map<string, CourseProps>,
//     action: AddCourseAction
// ): Map<string, CourseProps> => {
//     switch (action.type) {
//     case "ADD COURSE":
//         return state.set(action.payload.id, action.payload);
//     }
// };

// const courseInit = (
//     courses: Map<string, CourseProps>
// ): Map<string, CourseProps> => {
//     if (courses) return courses;
//     else return new Map<string, CourseProps>();
// };
const Semester = (props: SemesterProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    /* const [courses, updateCourses] = useReducer(
        courseReducer,
        props.courses,
        courseInit
    );
*/
    const handleCourseSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // updateCourses("");
    };
    // const addedCourses = Array.from(courses).map(
    //     ([courseID, course]: [string, CourseProps]) => {
    //         return (
    //             <div key={courseID}>
    //                 <Course {...course} />{" "}
    //             </div>
    //         );
    //     }
    // );

    return (
        <>
            <AddCourse
                isOpen={isOpen}
                onClickClose={() => setIsOpen(false)}
                onClickSubmit={(event: FormEvent<HTMLFormElement>) => {
                    handleCourseSubmit(event);
                }}
                onChange={(event: FormEvent<HTMLFormElement>) => {
                    handleCourseSubmit(event);
                }}
            ></AddCourse>

            {props.name}
            <button
                className="trigger"
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                +
            </button>
        </>
    );
};

export default Semester;
