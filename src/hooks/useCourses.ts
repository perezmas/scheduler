import { useReducer } from "react";
import CourseProps from "../interfaces/Course";

export interface CourseAction {
    type: "ADD COURSE" | "REMOVE COURSE";
    payload: CourseProps;
}

// easy access to the courses

const courseReducer = (
    state: Map<string, CourseProps>,
    action: CourseAction
): Map<string, CourseProps> => {
    switch (action.type) {
    case "ADD COURSE":
        return state.set(action.payload.id, action.payload);
    case "REMOVE COURSE": {
        const newState = new Map<string, CourseProps>(state);
        newState.delete(action.payload.id);
        return newState;
    }
    }
};

// const onRightClickCourse = (event: React.MouseEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     console.log("Right Clicked");
// };

const courseInit = (
    courses?: Map<string, CourseProps>
): Map<string, CourseProps> => {
    if (courses) return courses;
    else return new Map<string, CourseProps>();
};
export interface Courses {
    courseList: Map<string, CourseProps>;
    removeCourse: (courseID: string) => void;

    updateCourses: (action: CourseAction) => void;
}
function useCourses(initialCourses?: Map<string, CourseProps>): Courses {
    {
        const [courses, updateCourses] = useReducer(
            courseReducer,
            initialCourses,
            courseInit
        );

        const onRemoveCourse = (courseID: string) => {
            //get the course to remove
            const courseToRemove = courses.get(courseID);
            if (courseToRemove) {
                const action: CourseAction = {
                    type: "REMOVE COURSE",
                    payload: courseToRemove,
                };
                updateCourses(action);
                console.log("Removed course ID: ", courseID);
            }
        };

        return {
            courseList: courses,
            removeCourse: onRemoveCourse,

            updateCourses: updateCourses,
        };
    }
}
export default useCourses;
