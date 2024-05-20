export interface Group {
    id: number | null
    name: string
    description: string
    year: number | null
    users: [{id: number}]
    files: [{id: number}]
    course: {id: number}
    timeTables: [{id: number}]
    room: {id: number} | null
}