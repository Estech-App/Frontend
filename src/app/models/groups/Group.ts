import { User } from "../users/User"
import { TimeTable } from "./TimeTable"

export interface Group {
    id: number | null
    name: string
    description: string
    year: number | string
    roomId: number | null
    courseId: number | null
    users: User[]
    evening: boolean
    timeTables: TimeTable[]
}