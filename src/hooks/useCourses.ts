import { useReducer } from "react";
import CourseProps from "../interfaces/Course";
import { getByUUID } from "./useYears";

export interface AbstractCourseAction {
    type: "ADD COURSE" | "REMOVE COURSE";
}

export interface AddCourseAction {
    type: "ADD COURSE",
    newCourse: CourseProps
}

export interface RemoveCourseAction {
    type: "REMOVE COURSE",
    uuid: string
}

// easy access to the courses

const courseReducer = (state: Array<CourseProps>,action: AbstractCourseAction): Array<CourseProps> => {
    const newState = state.map((course: CourseProps) => {
        return course;
    });
    switch (action.type) {
    case "ADD COURSE": {
        const realAction = action as AddCourseAction;
        newState.push(realAction.newCourse);
        return newState;
    }
    case "REMOVE COURSE": {
        const realAction = action as RemoveCourseAction;
        const target = getByUUID(newState, realAction.uuid);
        if(target !== -1){
            newState.splice(target, 1);
        }
        return newState;
    }
    }
};

const courseInit = (courses?: Array<CourseProps>): Array<CourseProps> => {
    return courses === undefined ? [] : courses;
};

export interface Courses {
    courseList: Array<CourseProps>;
    removeCourse: (courseID: string) => void;
    push: (course: CourseProps) => void;
}
function useCourses(initialCourses?: Array<CourseProps>): Courses {
    const [courses, updateCourses] = useReducer(
        courseReducer,
        initialCourses,
        courseInit
    );

    const push = (course: CourseProps) => {
        const action: AddCourseAction = {type: "ADD COURSE", newCourse: course};
        updateCourses(action);
    };

    const remove = (uuid: string) => {
        const action: RemoveCourseAction = {type: "REMOVE COURSE", uuid: uuid};
        updateCourses(action);
    };

    return {
        courseList: courses,
        removeCourse: remove,
        push: push,
    };
}
export default useCourses;
