interface CourseProps {
    /**The course ID */
    id: string;
    /* The name of the course */
    name: string;
    /**The description of the course */
    description: string;
    /**How many credits the course is worth */
    credits: number;
    /* The uuid of the semester the course is being taken */
    semester: string;
    /**What courses need to be taken with this one.  */
    coreqs: Array<string>;
    /**What courses need to be taken before this one. */
    prereqs: Array<string>;
}

export default CourseProps;
