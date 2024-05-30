import { Course } from "../courses/Course"

export interface ModuleDTO {
    id: number,
    year: number,
    name: string,
    acronym: string,
    courseAcronym: string,
    courseDTO: Course
    usersName: string[]
}
