import SemesterProps from "./Semester";

export interface YearProps{
    uuid: string,
    level: "JUNIOR" | "SENIOR" | "SOPHOMORE" | "FRESHMAN" | "OTHER",
    num: number,
};

export interface YearState{
    semesters: Map<string,SemesterProps> | null
}