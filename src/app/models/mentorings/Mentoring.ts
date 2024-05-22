import { Room } from "../rooms/Room"
import { User } from "../users/User"

export interface Mentoring {
    id: number | null
	start: string
	end: string
    status: string
    roomId: number
    student: User
    teacher: User
}