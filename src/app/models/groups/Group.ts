import { User } from "../users/User"

export interface Group {
    id: number | null
    name: string
    description: string
    year: number
    roomId: number
    courseId: number
    users: User[]
}