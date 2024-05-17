import { Room } from "../rooms/Room"
import { User } from "../users/User"

export interface FreeUsage {
    id: number | null
    date: string
    status: string
    room: Room
    user: User
}