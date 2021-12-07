import { useReducer } from "react";
import CourseData from "../interfaces/Course";
import { getByUUID } from "./useYears";

export interface AbstractCourseAction {
    type: "ADD COURSE" | "REMOVE COURSE" | "UPDATE COURSE";
}

export interface AddCourseAction {
    type: "ADD COURSE";
    newCourse: CourseData;
}

export interface RemoveCourseAction {
    type: "REMOVE COURSE";
    uuid: string;
}

export interface UpdateCourseAction {
    type: "UPDATE COURSE";
    id: string;
    payload: CourseData;
}

type CourseAction<T extends "ADD COURSE" | "REMOVE COURSE" | "UPDATE COURSE"> = 
T extends "ADD COURSE" ? AddCourseAction :
T extends "REMOVE COURSE" ? RemoveCourseAction : 
UpdateCourseAction;

// easy access to the courses

function courseReducer<T extends "ADD COURSE" | "REMOVE COURSE" | "UPDATE COURSE">(state: Array<CourseData>,action: CourseAction<T>): Array<CourseData> {
    const newState = state.map((course: CourseData) => {
        return {...course};
    });
    switch (action.type) {
    case "ADD COURSE": {
        const realAction = action as AddCourseAction;
        newState.push({...realAction.newCourse});
        return newState;
    }
    case "REMOVE COURSE": {
        const realAction = action as RemoveCourseAction;
        const target = getByUUID(newState, realAction.uuid);
        if (target !== -1) {
            newState.splice(target, 1);
        }
        return newState;
    }
    case "UPDATE COURSE": {
        const realAction = action as UpdateCourseAction;
        const target = getByUUID(newState, realAction.id);
        newState.splice(target, 1);
        newState.push(realAction.payload);
        return newState;
    }
    default:
        throw new Error("Unknown action type");
    }
}

const courseInit = (courses?: Array<CourseData>): Array<CourseData> => {
    return courses === undefined ? [] : courses;
};

export interface Courses {
    courseList: Array<CourseData>;
    removeCourse: (courseID: string) => void;
    push: (course: CourseData) => void;
    move: (target: string, destinationUuid: string) => void;
}
function useCourses(initialCourses?: Array<CourseData>): Courses {
    const [courses, updateCourses] = useReducer(
        courseReducer,
        initialCourses,
        courseInit
    );

    const push = (course: CourseData) => {
        //check if course is already in the list
        const target = getByUUID(courses, course.uuid);
        if (target !== -1) {
            updateCourses({
                type: "UPDATE COURSE",
                id: course.uuid,
                payload: course,
            });
        } else {
            updateCourses({
                type: "ADD COURSE",
                newCourse: course,
            });
        }
    };

    const remove = (uuid: string) => {
        updateCourses({
            type: "REMOVE COURSE",
            uuid: uuid,
        });
    };

    const move = (uuid: string, destinationUuid: string) => {
        const target = getByUUID(courses, uuid);
        if(target != -1){
            const old = {...courses[target]};
            old.semester = destinationUuid;
            updateCourses({
                type: "UPDATE COURSE",
                id: uuid,
                payload: old
            });
        }  
    };

    return {
        courseList: courses,
        removeCourse: remove,
        push,
        move
    };
}
export default useCourses;
