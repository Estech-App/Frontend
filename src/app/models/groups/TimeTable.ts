export interface TimeTable {
    id: number | null
    groupId: number
    moduleId: number
    start: string
    end: string
    weekday: string
}