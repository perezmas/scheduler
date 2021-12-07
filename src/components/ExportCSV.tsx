import React from "react";
import { Button } from "react-bootstrap";
import { Years } from "../hooks/useYears";
import { Courses } from "../hooks/useCourses";
import FileSaver from "file-saver";

interface ExportCSVProps {
    years: Years;
    courses: Courses;
}
const ExportCSV = (props: ExportCSVProps): JSX.Element => {
    //helper function to handle exporting the schedule as a CSV file
    const exportCSV = () => {
        //initialize headers of the CSV
        let csv =
            "year,semester,course-id,course-name,course-description,course-credits,corequisites,prerequisites\n";
        props.years.value.forEach((year) => {
            year.semesters.forEach((semester) => {
                const coursesToAdd = props.courses.courseList.filter(
                    (course) => {
                        return course.semester === semester.uuid;
                    }
                );
                coursesToAdd.forEach((course) => {
                    const coreqs = course.coreqs.join("|");
                    const prereqs = course.prereqs.join("|");

                    csv += `${year.index},${semester.name},${course.id},${course.name},${course.description},${course.credits},${coreqs},${prereqs}\n`;
                });
            });
        });
        // Create a blob of the CSV
        const csvFile = new Blob([csv], { type: "text/csv;charset=utf-8;" });

        // Download the file
        FileSaver.saveAs(csvFile, "schedule.csv");
    };
    return (
        <Button as="a" href="#" onClick={exportCSV} className="export-button">
            Export CSV
        </Button>
    );
};

export default ExportCSV;
