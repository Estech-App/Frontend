export interface TimeTable {
    id: number | null | string
    schoolGroupId: number
    moduleId: number
    start: string
    end: string
    weekday: string
}