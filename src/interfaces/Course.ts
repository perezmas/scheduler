interface CourseProps /*extends AbstractProps*/ {
    /**The uuid of the semester containing this course.*/
    // parent: string;
    /**The department of the course */
    // department: string | null;
    /**The course ID */
    id: string;
    /* The name of the course */
    name: string;
    /**The description of the course */
    description: string;
    /**How many credits the course is worth */
    // credits: number;
    /**What courses need to be taken with this one.  */
    // coreqs: Array<CourseProps> | null;
    /**What courses need to be taken before this one. */
    // prereqs: Array<CourseProps> | null
}

export default CourseProps;